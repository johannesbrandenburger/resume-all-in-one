import { ImageResponse } from 'next/og'
import data from "../../../in/data.json"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 15,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        {data.preName[0] + data.lastName[0]}
      </div>
    ),
    {
      ...size,
    }
  )
}