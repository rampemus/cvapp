import React from 'react'
import './HexaBackground.css'
// import useWindowDimensions from '../hooks/useWindowDimensions'

interface Props {
    height: number,
    bottom?: boolean
}

// TODO: move this to css
enum Color {
    EMPTY = '',
    LIGHT = 'rgb(219, 223, 224)',
    GREY = 'rgb(195,202,209)',
    BLUE = 'rgb(189,205,219)',
    DARK = 'rgb(172,176,187)',
    STROKE_LIGHT = 'rgb(212, 213, 214)',
    STROKE_HIGHLIGHT = 'rgb(184, 191, 204)', 
}

const Background: React.FC<Props> = (props: Props) => {

    // const { height } = props

    const hexaSize = 46
    const spacing = 7
    const cos30 = 1.5/Math.sqrt(3)

    const hexagon = (x: number, y: number, hexaSize: number, color: Color, index: string) => {
        if ( color === Color.EMPTY ) {
            return ''
        }
        const strokeColor = color === Color.LIGHT ? Color.STROKE_LIGHT : Color.STROKE_HIGHLIGHT
        const point1 = `${ x - hexaSize }, ${ y } `
        const point2 = `${x - hexaSize * .5}, ${y - hexaSize * cos30 } `
        const point3 = `${x + hexaSize * .5}, ${y - hexaSize * cos30 } `
        const point4 = `${ x + hexaSize },${ y } `
        const point5 = `${x + hexaSize * .5}, ${y + hexaSize * cos30 } `
        const point6 = `${x - hexaSize * .5}, ${y + hexaSize * cos30 } `
        const points = point1.concat(point2,point3,point4,point5,point6)
        return <polygon key={index} points={points} style={{ stroke: strokeColor, strokeWidth: 3, fill: color }}/>
    }

    const hexaRow = (x: number, y: number, hexaSize: number, spacing: number, colors: Color[], rowIndex:number) => {
        const dx = hexaSize * 3 + spacing * 2 * cos30
        return <g key={`hexaRow${rowIndex}`}>
            {colors.map((color,index)=>{
                return hexagon(x + dx * index, y, hexaSize, color, `r${rowIndex}h${index}`)
            })}
        </g>
    }

    const transformToColorArray = ( numbers:number[] ) => {
        let result:Color[] = []
        numbers.forEach((color, index) => {
            if ( color < 1 ) {
                result.push(Color.EMPTY)
            } else if ( color < 2) {
                result.push(Color.LIGHT)
            } else if (color < 3) {
                result.push(Color.GREY)
            } else if (color < 4) {
                result.push(Color.BLUE)
            } else {
                result.push(Color.DARK)
            }
        });
        return result
    }

    const drawHexaGrid = (numberGrid: number[][]) => {
        const dy = hexaSize * 2 * cos30 + spacing
        return (
            <svg height='100%' width='100%' viewBox='0 0 1200 1200' preserveAspectRatio={props.bottom ? "xMidYMin slice" : "xMidYMin slice"} className={props.bottom ? 'bottom-hexa' : 'top-hexa'}>
                {numberGrid.map( (numbers:number[], index) => {
                        if ( index%2 === 0 ) {
                            return hexaRow( 0, 0 + dy * index/2, hexaSize, spacing, transformToColorArray(numbers), index)
                        } else {
                            return hexaRow(0 + hexaSize * 1.5 + spacing * cos30, 0 + hexaSize * cos30 + spacing * .5 + dy * (index - 1) / 2,
                                hexaSize, spacing, transformToColorArray(numbers), index)
                        }
                    })}
                {/* <text x='4' y='50%'>{height}</text> */}
            </svg>
        )
    } 

    if (props.bottom) {
        return <div>
            {drawHexaGrid(
                [
                    [0, 0, 0, 0, 0, 0, 0, 0, 0],
                    [1, 0, 1, 0, 0, 0, 0, 0],
                    [1, 0, 1, 0, 0, 0, 0, 0, 1],
                    [1, 0, 0, 1, 1, 0, 1, 1],
                    [3, 1, 1, 0, 0, 1, 1, 1, 2],
                    [2, 1, 1, 1, 1, 1, 1, 2],
                    [3, 2, 2, 1, 1, 1, 1, 2, 4],
                    [4, 3, 2, 1, 1, 1, 2, 4],
                    [3, 3, 3, 3, 2, 2, 3, 3, 2],
                    [2, 2, 4, 4, 2, 2, 4, 3],
                    [2, 2, 3, 2, 3, 3, 3, 2, 3],
                ]
            )
        }</div>
    } else {
        return <div>
            {drawHexaGrid(
                [
                    [3, 2, 3, 2, 3, 3, 3, 2, 3],
                    [3, 2, 4, 2, 2, 2, 2, 4],
                    [3, 2, 3, 2, 3, 4, 3, 2, 3],
                    [4, 2, 4, 2, 3, 4, 2, 4],
                    [3, 2, 2, 2, 2, 1, 1, 2, 4],
                    [2, 1, 1, 1, 1, 1, 2, 2],
                    [3, 1, 1, 1, 1, 1, 1, 1, 2],
                    [1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 1, 1, 1, 1, 1, 1],
                    [1, 1, 1, 0, 1, 0, 1, 1],
                    [1, 1, 0, 1, 0, 1, 0, 1, 1],
                    [1, 0, 0, 0, 0, 0, 1, 1],
                ]
            )}
        </div>
    }
    
}

export default Background
