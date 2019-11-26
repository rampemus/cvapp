import React from 'react'
import './HexaBackground.css'
import useWindowDimensions from '../hooks/useWindowDimensions'
import { emptyStatement } from '@babel/types'

interface Props {
    height: number
}

enum Color {
    EMPTY = '',
    LIGHT = 'rgb(212, 213, 214)',
    GREY = 'rgb(195,202,209)',
    BLUE = 'rgb(189,205,219)',
    DARK = 'rgb(172,176,187)',
    STROKE_LIGHT = 'rgb(219, 223, 224)',
    STROKE_HIGHLIGHT = 'rgb(184, 191, 204)', 
}

const Background: React.FC<Props> = (props: Props) => {

    const { height } = props

    const hexaSize = 46
    const spacing = 7
    const cos30 = 1.5/Math.sqrt(3)

    const hexagon = (x: number, y: number, hexaSize: number, color: Color) => {
        if ( color !== Color.EMPTY ) {
            const strokeColor = color === Color.LIGHT ? Color.STROKE_LIGHT : Color.STROKE_HIGHLIGHT
            const point1 = `${ x - hexaSize }, ${ y } `
            const point2 = `${x - hexaSize * .5}, ${y - hexaSize * cos30 } `
            const point3 = `${x + hexaSize * .5}, ${y - hexaSize * cos30 } `
            const point4 = `${ x + hexaSize },${ y } `
            const point5 = `${x + hexaSize * .5}, ${y + hexaSize * cos30 } `
            const point6 = `${x - hexaSize * .5}, ${y + hexaSize * cos30 } `
            const points = point1.concat(point2,point3,point4,point5,point6)
            return <polygon points={points} style={{ stroke: strokeColor, strokeWidth: 3, fill: color }}/>
        }
        return ''
    }

    const hexaRow = (x: number, y: number, hexaSize: number, spacing: number, colors: Color[]) => {
        const dx = hexaSize * 3 + spacing * 2 * cos30

        return <g>
            {hexagon(x, y, hexaSize, Color.DARK)}
            {hexagon(x + dx, y, hexaSize, Color.GREY)}
            {hexagon(x + dx * 2, y, hexaSize, Color.BLUE)}
            {hexagon(x + dx * 3, y, hexaSize, Color.LIGHT)}
        </g>
    }

    const drawHexaGrid = () => {
        const dy = hexaSize * 2 * cos30 + spacing

        return (
            <svg height='100%' width='100%' viewBox='0 0 1200 1200' preserveAspectRatio="xMidYMin slice">
                {hexaRow(0, 0, hexaSize, spacing, [Color.EMPTY])}
                {hexaRow( 0 + hexaSize * 1.5 + spacing * cos30, 
                    0 + hexaSize * cos30 + spacing * .5,
                    hexaSize, spacing, [Color.EMPTY])}
                {hexaRow( 0, 0 + dy, hexaSize, spacing, [Color.EMPTY])} 
            </svg>
        )
    } 

    return <div>
        {drawHexaGrid()}
    </div>
    
}

export default Background
