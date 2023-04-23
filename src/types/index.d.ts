export type ClicksAtomI = ClickCords[]
export type ClickCords = {
  y: number
  x: number
  id: string
}

export type FindNextClickByIdI = { clicksHistory: ClickCords[]; id: string }
