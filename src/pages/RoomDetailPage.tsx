import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight } from 'lucide-react'
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

  if (!id || !Number.isInteger(roomId) || roomId < 1) return <PageFrame><StatePanel title="Room details unavailable">The room identifier is not valid.<Link to="/rooms" className="mt-4 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300"><ArrowLeft size={15} />Study rooms</Link></StatePanel></PageFrame>
  if (roomQuery.isPending) return <PageFrame><div className="h-48 animate-pulse rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950" role="status">Loading room details…</div></PageFrame>
  if (roomQuery.isError || !roomQuery.data) return <PageFrame><StatePanel title="Room details unavailable" role="alert">{roomQuery.error instanceof Error ? roomQuery.error.message : 'We could not find this room.'}<button type="button" onClick={() => void roomQuery.refetch()} className="mt-4 block min-h-9 rounded-lg border border-slate-300 px-3 text-sm font-semibold hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-700 dark:hover:bg-slate-900">Try again</button><Link to="/rooms" className="mt-3 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300"><ArrowLeft size={15} />Study rooms</Link></StatePanel></PageFrame>

  const room = roomQuery.data
  const amenities = [...new Set([...(room.amenities ?? []), ...(room.hasProjector ? ['projector'] : [])])]
  return <PageFrame className="max-w-4xl">
    <Link to="/rooms" className="mb-5 inline-flex min-h-9 items-center gap-1 rounded-md text-sm font-medium text-slate-600 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-slate-300 dark:hover:text-white"><ArrowLeft size={16} />Study rooms</Link>
    <PageHeading eyebrow="Room details" title={room.name} description={room.building} actions={<span className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-medium ${room.isAvailable ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>{room.isAvailable ? 'Generally available' : 'Unavailable'}</span>} />

    <dl className="grid gap-x-10 sm:grid-cols-2">
      <DetailItem label="Capacity" value={`${room.capacity} ${room.capacity === 1 ? 'person' : 'people'}`} />
      <div className="border-t border-slate-200 py-4 dark:border-slate-800 sm:border-t-0"><dt className="text-sm font-medium text-slate-500 dark:text-slate-400">Amenities</dt><dd className="mt-2 text-sm leading-6 text-slate-900 dark:text-slate-100">{amenities.length ? amenities.map((amenity) => amenityLabels[amenity] ?? amenity).join(' · ') : 'No amenity details listed'}</dd></div>
      <div className="border-t border-slate-200 py-4 dark:border-slate-800 sm:col-span-2"><dt className="text-sm font-medium text-slate-500 dark:text-slate-400">About availability</dt><dd className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Specific time availability depends on your reservation request.</dd></div>
    </dl>

    <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800"><button type="button" disabled={!room.isAvailable} onClick={() => navigate('/reservations', { state: { roomId: room.id } })} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 dark:disabled:bg-slate-800">{room.isAvailable ? <>Reserve this room <ArrowRight size={16} /></> : 'Unavailable'}</button></div>
  </PageFrame>
}

function DetailItem({ label, value }: { label: string; value: string }) { return <div className="py-4"><dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt><dd className="mt-2 text-sm font-medium text-slate-900 dark:text-white">{value}</dd></div> }
function StatePanel({ title, children, role }: { title: string; children: React.ReactNode; role?: 'status' | 'alert' }) { return <section className="py-5" role={role}><h1 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h1><div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{children}</div></section> }

export default RoomDetailPage
