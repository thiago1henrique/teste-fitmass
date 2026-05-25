'use client'

import { useEffect } from 'react'

export default function ConsoleArt() {
  useEffect(() => {
    console.log(
      '\n%c'
      + ' _____  ___  _____  __  __     _      ____   ____  \n'
      + '|  ___||_ _||_   _||  \\/  |   / \\    / ___| / ___| \n'
      + '| |_    | |   | |  | |\\/| |  / _ \\   \\___ \\ \\___ \\ \n'
      + '|  _|   | |   | |  | |  | | / ___ \\   ___) | ___) |\n'
      + '|_|    |___|  |_|  |_|  |_|/_/   \\_\\ |____/ |____/ \n'
      + '%c  Transformando dados em bem-estar: sua saúde, nossa tecnologia.\n\n',
      'color:#88BD23;font-family:monospace;font-weight:bold;font-size:10px;line-height:1.4',
      'color:#bbb;font-family:monospace;font-size:11px;line-height:2.5',
    )
  }, [])

  return null
}
