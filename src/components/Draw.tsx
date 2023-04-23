import { ClickCords } from '@/types'

type props = {
  cords: ClickCords
}

export default function Draw({ cords }: props) {
  const { x, y } = cords

  const top = `${y}px`
  const left = `${x}px`

  return (
    <div
      style={{ top, left }}
      className={`w-[12px] h-[12px]  rounded-full bg-emerald-500 absolute`}
    ></div>
  )
}
