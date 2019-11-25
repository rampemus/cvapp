import React from 'react'
import './HexaBackground.css'
import useWindowDimensions from './hooks/useWindowDimensions'

const Background: React.FC = (props) => {

    // const { height, width } = useWindowDimensions();

    const hexaSize = 46
    const spacing = 7
    const cos30 = 1.5/Math.sqrt(3)

    const lightHexaColor = 'rgb(212, 213, 214)'
    const lightHexaStrokeColor = 'rgb(219, 223, 224)'

    const highlightStrokeColor = 'rgb(184,191,204'
    const greyHexaColor = 'rgb(195,202,209)'
    const blueHexaColor = 'rgb(189,205,219)'
    const darkHexaColor = 'rgb(172,176,187)'

    const hexagon = (x: number, y: number, hexaSize: number) => {
        const point1 = `${ x - hexaSize }, ${ y } `
        const point2 = `${x - hexaSize * .5}, ${y - hexaSize * cos30 } `
        const point3 = `${x + hexaSize * .5}, ${y - hexaSize * cos30 } `
        const point4 = `${ x + hexaSize },${ y } `
        const point5 = `${x + hexaSize * .5}, ${y + hexaSize * cos30 } `
        const point6 = `${x - hexaSize * .5}, ${y + hexaSize * cos30 } `
        const points = point1.concat(point2,point3,point4,point5,point6)
        return <polygon points={points} style={{ stroke: highlightStrokeColor, strokeWidth: 3, fill: darkHexaColor }}/>
    }

    const hexaRow = (x: number, y: number, hexaSize: number, spacing: number) => {
        const dx = hexaSize * 3 + spacing * 2 * cos30

        return <g>
            {hexagon(x, y, hexaSize)}
            {hexagon(x + dx, y, hexaSize)}
            {hexagon(x + dx * 2, y, hexaSize)}
        </g>
            
    }

    const dy = hexaSize * 2 * cos30 + spacing

    return(
        <div>
            {/* <p>height: {height} & width:{width} </p> */}
            <svg viewBox='0 0 800 800'>
                {/*TODO:create different backgrounds for different weather*/}
                {hexaRow(
                    0, 
                    0, 
                    hexaSize, 
                    spacing
                  )}
                {hexaRow(
                    0 + hexaSize * 1.5 + spacing *cos30, 
                    0 + hexaSize * cos30 + spacing *.5, 
                    hexaSize, 
                    spacing
                  )}
                {hexaRow(
                    0, 
                    0 + dy, 
                    hexaSize, 
                    spacing
                  )}
            </svg>
        </div>
    )
}

export default Background
