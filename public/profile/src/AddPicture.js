import React from 'react';
import ImageUploader from 'react-images-upload';
 

export function AddPicture() {
    return (
        <ImageUploader
        withIcon={true}
        buttonText='Upload Avatar'
        imgExtension={['.jpg', '.gif', '.png', '.gif']}
        maxFileSize={5242880}
    />
    )
}