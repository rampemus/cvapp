import React, { useState, useEffect } from 'react'

interface OwnProps {
  initLevel: string,
  handleChange(newLevel: string): void,
  id: string
}

export enum ILevel {
  Elementary = 'Elementary',
  EveryDay = 'Every day proficiency',
  Working = 'Working proficiency',
  Advanced = 'Advanced',
  Professional = 'Professional',
  Native = 'Native speaker'
}

const levels = [ILevel.Elementary, ILevel.EveryDay, ILevel.Working, ILevel.Advanced, ILevel.Professional, ILevel.Native]

const MyCVFormLanguageLevelSelector: React.FC<OwnProps> = (props) => {

  const [level, setLevel] = useState(props.initLevel)

  useEffect(() => {
    setLevel(props.initLevel)
  }, [props.initLevel])

  const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault()

    setLevel(event.target.value)
    props.handleChange(event.target.value.toString())
  }

  return <div>
    <select id={props.id} onChange={handleLevelChange} value={level} className='language-level-selector'>
      {levels.map(level => <option key={level} value={level}>{level}</option>)}
    </select>
  </div>

}

export default MyCVFormLanguageLevelSelector
