import React, { useEffect, useState } from 'react'
import { Grid, Card, Statistic } from 'semantic-ui-react'

import { useSubstrateState } from '../substrate-lib'
// import { TxButton } from '../substrate-lib/components'

function Main(props) {
  const { api } = useSubstrateState()

  // The transaction submission status
 // const [status, setStatus] = useState('')

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0)
  //const [formValue, setFormValue] = useState(0)

  useEffect(() => {
    let unsubscribe
    api.query.vendeoNft
      .collectionIndex(value => {
        console.log('%%% collections index: ' + value)
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        if (value.isNone) {
          setCurrentValue('<None>')
        } else {
          setCurrentValue(value.toNumber())
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
      <h1>Nft Collections</h1>
      <Card centered>
        <Card.Content textAlign="center">
          <Statistic label="Nombre de Collections" value={currentValue} />
        </Card.Content>
      </Card>
    </Grid.Column>
  )
}

export default function NftCollections(props) {
  const { api } = useSubstrateState()
  return api.query.vendeoNft && api.query.vendeoNft.collectionIndex ? (
    <Main {...props} />
  ) : null
}
