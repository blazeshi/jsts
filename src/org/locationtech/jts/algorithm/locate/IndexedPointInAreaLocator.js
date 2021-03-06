import hasInterface from '../../../../../hasInterface'
import IllegalArgumentException from '../../../../../java/lang/IllegalArgumentException'
import ItemVisitor from '../../index/ItemVisitor'
import PointOnGeometryLocator from './PointOnGeometryLocator'
import LinearRing from '../../geom/LinearRing'
import SortedPackedIntervalRTree from '../../index/intervalrtree/SortedPackedIntervalRTree'
import LineSegment from '../../geom/LineSegment'
import Polygonal from '../../geom/Polygonal'
import LinearComponentExtracter from '../../geom/util/LinearComponentExtracter'
import ArrayListVisitor from '../../index/ArrayListVisitor'
import RayCrossingCounter from '../RayCrossingCounter'
export default class IndexedPointInAreaLocator {
  constructor () {
    IndexedPointInAreaLocator.constructor_.apply(this, arguments)
  }

  locate (p) {
    const rcc = new RayCrossingCounter(p)
    const visitor = new SegmentVisitor(rcc)
    this._index.query(p.y, p.y, visitor)
    return rcc.getLocation()
  }

  getClass () {
    return IndexedPointInAreaLocator
  }

  get interfaces_ () {
    return [PointOnGeometryLocator]
  }
}
class SegmentVisitor {
  constructor () {
    SegmentVisitor.constructor_.apply(this, arguments)
  }

  visitItem (item) {
    const seg = item
    this._counter.countSegment(seg.getCoordinate(0), seg.getCoordinate(1))
  }

  getClass () {
    return SegmentVisitor
  }

  get interfaces_ () {
    return [ItemVisitor]
  }
}
SegmentVisitor.constructor_ = function () {
  this._counter = null
  const counter = arguments[0]
  this._counter = counter
}
class IntervalIndexedGeometry {
  constructor () {
    IntervalIndexedGeometry.constructor_.apply(this, arguments)
  }

  init (geom) {
    const lines = LinearComponentExtracter.getLines(geom)
    for (let i = lines.iterator(); i.hasNext();) {
      const line = i.next()
      const pts = line.getCoordinates()
      this.addLine(pts)
    }
  }

  addLine (pts) {
    for (let i = 1; i < pts.length; i++) {
      const seg = new LineSegment(pts[i - 1], pts[i])
      const min = Math.min(seg.p0.y, seg.p1.y)
      const max = Math.max(seg.p0.y, seg.p1.y)
      this._index.insert(min, max, seg)
    }
  }

  query () {
    if (arguments.length === 2) {
      const min = arguments[0]; const max = arguments[1]
      const visitor = new ArrayListVisitor()
      this._index.query(min, max, visitor)
      return visitor.getItems()
    } else if (arguments.length === 3) {
      const min = arguments[0]; const max = arguments[1]; const visitor = arguments[2]
      this._index.query(min, max, visitor)
    }
  }

  getClass () {
    return IntervalIndexedGeometry
  }

  get interfaces_ () {
    return []
  }
}
IntervalIndexedGeometry.constructor_ = function () {
  this._index = new SortedPackedIntervalRTree()
  const geom = arguments[0]
  this.init(geom)
}
IndexedPointInAreaLocator.SegmentVisitor = SegmentVisitor
IndexedPointInAreaLocator.IntervalIndexedGeometry = IntervalIndexedGeometry
IndexedPointInAreaLocator.constructor_ = function () {
  this._index = null
  const g = arguments[0]
  if (!(hasInterface(g, Polygonal) || g instanceof LinearRing)) throw new IllegalArgumentException('Argument must be Polygonal or LinearRing')
  this._index = new IntervalIndexedGeometry(g)
}
