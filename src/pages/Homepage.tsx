'use client'

import { KeyboardEvent, MouseEvent, useEffect, useRef } from 'react'
import { useAtom } from 'jotai'
import { clicksAtom } from '@/contexts/atoms/clicks'
import { v4 as uuid } from 'uuid'
import Draw from '@/components/Draw'
import { clicksHistoryAtom } from '@/contexts/atoms/clicksClone'
import { FindNextClickByIdI } from '@/types'

export default function HomePage() {
  const windowRef = useRef<HTMLDivElement | null>(null)
  const [clicks, setClicks] = useAtom(clicksAtom)
  const [clicksHistory, setClicksHistory] = useAtom(clicksHistoryAtom)

  function findNextClickById({ clicksHistory, id }: FindNextClickByIdI) {
    const currentIndex = clicksHistory.findIndex((click) => click.id === id)
    const nextIndex = (currentIndex + 1) % clicksHistory.length
    return clicksHistory[nextIndex]
  }

  function fowardClick() {
    const lastClick = clicks[clicks.length - 1]

    if (clicks.length == 0) {
      setClicks((oldClicks) => {
        const newClicks = [...oldClicks, clicksHistory[0]]
        return newClicks
      })

      return
    }

    if (clicksHistory.length == clicks.length) {
      return
    }

    const nextClick = findNextClickById({ clicksHistory, id: lastClick.id })

    setClicks((oldClicks) => {
      const newClicks = [...oldClicks]
      newClicks.push(nextClick)
      return newClicks
    })
  }

  function backwardClick() {
    if (clicks.length == 0) {
      return
    }

    setClicks((oldClicks) => {
      const newClicks = [...oldClicks]
      newClicks.pop()
      return newClicks
    })
  }

  function handleWindowKeypress(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey && e.code === 'KeyZ') {
      fowardClick()
      return
    }

    if (e.ctrlKey && e.code === 'KeyZ') {
      backwardClick()
    }
  }

  function handleWindowClick(e: MouseEvent) {
    const cords = {
      y: e.clientY,
      x: e.clientX,
      id: uuid(),
    }

    setClicks([...clicks, cords])
    setClicksHistory([...clicks, cords])
  }

  return (
    <div
      ref={windowRef}
      className='w-screen h-screen bg-neutral-950 relative'
      onClick={(e: MouseEvent) => handleWindowClick(e)}
      onKeyDown={(e: KeyboardEvent) => handleWindowKeypress(e)}
      tabIndex={0}
    >
      <div className='w-fit h-fit absolute bg-neutral-800 p-2 px-3 m-6 my-8 text-zinc-300 rounded-lg flex flex-col items-center'>
        <span>Ctrl + Z: backward</span>
        <div className='my-3 w-[90%] h-[1px] bg-neutral-700 m-auto'></div>
        <span>Ctrl + Shift + Z: foward</span>
      </div>
      {clicks.map((click) => {
        return <Draw key={uuid()} cords={click} />
      })}
    </div>
  )
}
