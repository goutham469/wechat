import React from 'react'
import { tools } from '../utils/tools';

function ImageUpload() {
  return (
    <div>
        <b>ImageUpload</b>
        <br/>
        
        <input
            type='file'
            onChange={ async (e) => {
                const file = e.target.files[0];
                const res = await tools.AWS_upload_file( file );
                console.log(res);
                alert("image uploaded")
            }}
        />
    </div>
  )
}

export default ImageUpload