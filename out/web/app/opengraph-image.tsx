import { ImageResponse } from 'next/og'
import data from "../../../in/data.json"

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'
 
export default async function Image() {

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Resume of {data.preName} {data.lastName}
      </div>
    ),
    {
      ...size,
    }
  )
}