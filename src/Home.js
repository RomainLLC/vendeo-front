import React, { createRef } from 'react'

import {
  Container,
  Dimmer,
  Loader,
  Grid,
  Sticky,
  Message,
} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import { SubstrateContextProvider, useSubstrateState } from './substrate-lib'
import { DeveloperConsole } from './substrate-lib/components'
import Header from './components/Header'
import Balances from './components/Balances'
import BlockNumber from './components/BlockNumber'
import Events from './components/Events'
import Interactor from './components/Interactor'
import Metadata from './components/Metadata'
import NodeInfo from './components/NodeInfo'
// import TemplateModule from './components/TemplateModule'
import Transfer from './components/Transfer'
// import Upgrade from './components/Upgrade'
import NftCollections from './components/NftCollections'
import NftExplorer from './components/NftExplorer'
import CreateCollection from './components/nft/CreateCollection'

function Main() {
  const { apiState, apiError, keyringState } = useSubstrateState()

  const loader = text => (
    <Dimmer active>
      <Loader size="small">{text}</Loader>
    </Dimmer>
  )

  const message = errObj => (
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message
          negative
          compact
          floating
          header="Error Connecting to Vendeo chain"
          content={`Connection to websocket '${errObj.target.url}' failed.`}
        />
      </Grid.Column>
    </Grid>
  )

  if (apiState === 'ERROR') return message(apiError)
  else if (apiState !== 'READY') return loader('Connecting to Vendeo chain')

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)"
    )
  }

  const contextRef = createRef()

  return (
    <div ref={contextRef} class="ui grid center aligned">
      <div class="ui externally celled grid">
            <div id="vendeo-body" class="sixteen wide column centered">
            <Sticky context={contextRef}>
              <Header />
            </Sticky>
        <div id="vendeo-header" class="sixteen wide column ad centered" data-text="Top Banner">
          <Container>
        <Grid stackable columns="equal">
        <Grid.Row stretched>
          <h1>Expérimentation d'une monnaie locale numérique basée sur la technologie blockchain.</h1>
          </Grid.Row>
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          </Grid>
        </Container>
        </div>

        <Container>
        <Grid stackable columns="equal">
          <Grid.Row stretched>
          <Balances />
          </Grid.Row>
          <Grid.Row stretched>
          <Transfer />
          </Grid.Row>
          <Grid.Row>
            <Interactor />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <NftCollections />
            <NftExplorer />
          </Grid.Row>
          <Grid.Row stretched>
          <CreateCollection />
          </Grid.Row>
          
          </Grid>
        </Container>
        <DeveloperConsole />
      {/* <Grid celled padded style={{with: '100vw'}}>

      <Container>

        <Grid stackable columns="equal">
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row stretched>
            <Balances />
          </Grid.Row>
          <Grid.Row>
            <Transfer />
            <Upgrade />
          </Grid.Row>
          <Grid.Row>
            <Interactor />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <TemplateModule />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
      </Grid> */}
            </div>
        </div>
    </div>
  )
}

export default function Home() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  )
}
