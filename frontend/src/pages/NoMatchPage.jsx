import React from 'react'
import { Frown } from 'lucide-react'

const NoMatchPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full gap-3">
      <Frown className="size-65"/>
      <span className="text-7xl font-bold">404</span>
      <span className="text-2xl font-bold">Nie znaleziono strony</span>
      <span className="text-xs">Niestety, ale strona której poszukujesz nie istnieje lub wstąpił błąd.</span>
    </div>
  )
}

export default NoMatchPage