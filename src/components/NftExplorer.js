import React, { useEffect, useState } from 'react'
import { Grid, Card } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'
// import { TxButton } from '../substrate-lib/components'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
 // const [status, setStatus] = useState('')

  // The currently stored value
  const [metadata, setMetadata] = useState(0)
  //const [formValue, setFormValue] = useState(0)

  useEffect(() => {
    let unsubscribe
    api.query.vendeoNft
      .nfts(0,0, value => {
        console.log('%%% nft metadata result: ' + value.unwrap().metadata.toHuman())
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        if (value.isNone) {
          setMetadata('<None>')
        } else {
          setMetadata(value.unwrap().metadata.toHuman())


        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.vendeoNft])

  return (
    <Grid.Column width={8}>
      <h1>Nft Explorer</h1>
      <Card centered>
        <Card.Content textAlign="center">
          <h3>METADATA</h3>
          {metadata}
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}

export default function NftExplorer(props) {
  const { api } = useSubstrateState()
  return api.query.vendeoNft && api.query.vendeoNft.nfts(0,0) ? (
    <Main {...props} />
  ) : null
}
