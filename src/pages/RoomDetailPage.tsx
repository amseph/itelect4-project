import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, MapPin, Users } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { fetchRoomById } from '../api/client'
import { PageFrame, PageHeading } from '../components/PageFrame'
import type { StudyRoom } from '../types'

const amenityLabels: Record<string, string> = { aircon: 'Air conditioning', tv: 'TV', whiteboard: 'Whiteboard', projector: 'Projector', 'quiet-zone': 'Quiet zone' }

function RoomDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const roomId = Number(id)
  const roomQuery = useQuery<StudyRoom>({ queryKey: ['rooms', id], queryFn: () => fetchRoomById(roomId), enabled: Boolean(id) && Number.isInteger(roomId) && roomId > 0 })

  if (!id || !Number.isInteger(roomId) || roomId < 1) return <PageFrame><section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950"><h1 className="text-2xl font-semibold text-slate-950 dark:text-white">Room details unavailable</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">The room identifier is not valid.</p><Link to="/rooms" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300"><ArrowLeft size={16} />Back to rooms</Link></section></PageFrame>
  if (roomQuery.isPending) return <PageFrame><div className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" role="status">Loading room details…</div></PageFrame>
  if (roomQuery.isError || !roomQuery.data) return <PageFrame><section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950" role="alert"><p className="text-sm font-medium text-blue-700 dark:text-blue-300">Study room</p><h1 className="mt-1 text-2xl font-semibold text-slate-950 dark:text-white">Room details unavailable</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{roomQuery.error instanceof Error ? roomQuery.error.message : 'We could not find this room.'}</p><Link to="/rooms" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300"><ArrowLeft size={16} />Back to rooms</Link></section></PageFrame>

  const room = roomQuery.data
  const amenities = [...new Set(room.amenities ?? [])]
  return <PageFrame>
    <Link to="/rooms" className="mb-5 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:bg-slate-800"><ArrowLeft size={16} />All rooms</Link>
    <PageHeading eyebrow="Room details" title={room.name} description={room.building} actions={<span className={`inline-flex min-h-9 items-center rounded-full px-3 text-sm font-medium ${room.isAvailable ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{room.isAvailable ? 'Generally available' : 'Unavailable'}</span>} />
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950 sm:p-6">
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Room information</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2"><DetailItem icon={<MapPin size={17} />} label="Location" value={room.building} /><DetailItem icon={<Users size={17} />} label="Capacity" value={`${room.capacity} ${room.capacity === 1 ? 'person' : 'people'}`} /><DetailItem label="Projector" value={room.hasProjector ? 'Listed as available' : 'Not listed'} /><DetailItem label="General status" value={room.isAvailable ? 'Generally available' : 'Unavailable'} /></dl>
        <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800"><h3 className="text-sm font-semibold text-slate-900 dark:text-white">Amenities</h3>{amenities.length ? <ul className="mt-3 flex flex-wrap gap-2">{amenities.map((amenity) => <li key={amenity} className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{amenityLabels[amenity] ?? amenity}</li>)}</ul> : <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">No amenity details are listed for this room.</p>}</div>
      </section>
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><h2 className="font-semibold text-slate-950 dark:text-white">Plan a session</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">Room status is general and does not confirm a particular time slot.</p><button type="button" disabled={!room.isAvailable} onClick={() => navigate('/reservations', { state: { roomId: room.id } })} className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800">{room.isAvailable ? <>Continue to reservation <ArrowRight size={16} /></> : 'Room unavailable'}</button></aside>
    </div>
  </PageFrame>
}

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) { return <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-900"><dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">{icon}{label}</dt><dd className="mt-1.5 text-sm font-medium text-slate-900 dark:text-white">{value}</dd></div> }

export default RoomDetailPage
