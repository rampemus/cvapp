import React from 'react'
import './Toolbar.scss'

const Toolbar: React.FC = (props) => <div className='toolbar'>
  {props.children}
</div>

export default Toolbar
