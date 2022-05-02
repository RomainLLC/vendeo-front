import React, {  useState } from "react";
import { Form, Image, Button, Container, Icon, Label, Progress } from 'semantic-ui-react';
import { create as ipfsHttpClient } from 'ipfs-http-client'

// TODO : move IPFS params to env file

// connect to the default API address http://localhost:5001
const ipfs = ipfsHttpClient('http://localhost:5001')
// const res = ipfs.cat("QmXykMPMHF5PZhPDFzfZZp8TeXvmXEybKSX6vEFi6pXe1X")
// console.log(res)
// const { CID } = require('ipfs-http-client')
//  let v1CID = new CID('QmXykMPMHF5PZhPDFzfZZp8TeXvmXEybKSX6vEFi6pXe1X').toV1().toString('base32')
// console.log(v1CID)
// const fileStat = await ipfs.files.stat("/ipfs/" + cid.path);


const UploadImage = () => {

 const [image, setImage] = useState({})
    const [imagePreview, setImagePreview] = useState('')
    const [loading, setLoading] = useState(false)
    const [uploaded, setUploaded] = useState(false)

    const createPreview = (e) => {
        if (e.target.value !== '') {
            setImage(e.target.files[0])
            const src = URL.createObjectURL(e.target.files[0])
            setImagePreview(src)
        } else {
            setImagePreview('')
        }
    }

    const uploadFile = async (e) => {
        setLoading(true)
        e.preventDefault()

        try {
            const added = await ipfs.add(image)
            const url = `http://localhost:8080/ipfs/${added.path}`
            console.warn(url);
            // setUrl(url)
            setImagePreview(url)
            setUploaded(true)

            this.props.parentCallback("Welcome to GFG");

        } catch (err) {
            console.log('Error uploading the file : ', err)
        }
        setLoading(false)
    }


    const previewAndUploadButton = () => {
      if (imagePreview !== '') {
          if (!loading) {
              return (
                  <div>
                      {uploaded ? (
                          <h5>
                              ✅{' '}
                              <a
                                  href={imagePreview}
                                  target='_blank'
                                  rel='noopener noreferrer'
                              >
                                  Image
                              </a>{' '}
                              Uploaded Successfully ✅{' '}
                          </h5>
                      ) : (
                          <div>
                              <Button type='submit' className='mb-3'>
                                  Upload Image
                              </Button>
                              <br />
                              <h5>
                                  {image.name}{' '}
                                  <Label>
                                    <Icon name='mail' /> {image.size} kb
                                 </Label>
                                 
                              </h5>

                              <Image
                                  style={{ height: '300px' }}
                                  className='mb-3'
                                  src={imagePreview}
                              />
                          </div>
                      )}
                  </div>
              )
          } else {
              return (
                  <Container>
                      <h4>Uploading Image</h4>
                      <Progress percent={100} indicating />

                      <h4>Please Wait ...</h4>
                  </Container>
              )
          }
      }
  }
  return (
    <div>
        <Form onSubmit={uploadFile}>
            <Form.Input
                type='file'
                accept='image/*'
                onChange={(e) => createPreview(e)}
            />

            {previewAndUploadButton()}
        </Form>
    </div>
)
}




export default UploadImage;