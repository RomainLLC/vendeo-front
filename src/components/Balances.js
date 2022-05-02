import React, { useEffect, useState } from 'react'
import { Table, Grid, Button, Label, Popup, Icon, Segment } from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import QRCode from "react-qr-code";

import { useSubstrateState } from '../substrate-lib'
import {formatBalance } from '@polkadot/util'

export default function Main(props) {
  const { api, keyring } = useSubstrateState()
  const accounts = keyring.getPairs()
  const [balances, setBalances] = useState({})

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address)
    let unsubscribeAll = null

    api.query.system.account
      .multi(addresses, balances => {
        const balancesMap = addresses.reduce(
          (acc, address, index) => ({
            ...acc,
           // [address]: balances[index].data.free.toHuman(),
           [address]: formatBalance(
            balances[index].data.free,
            { withSi: false, forceUnit: '-' },
            11 // TODO : use api.registry.chainDecimals ?
        )
          }),
          {}
        )
        setBalances(balancesMap)
      })
      .then(unsub => {
        unsubscribeAll = unsub
      })
      .catch(console.error)

    return () => unsubscribeAll && unsubscribeAll()
  }, [api, keyring, setBalances])

  return (
    <Grid.Column>
      <h1>Vos comptes</h1>
      {accounts.length === 0 ? (
        <Label basic color="yellow">
          Pas de compte trouvé.
        </Label>
      ) : (
        <Table celled striped size="small">
          <Table.Body>
            <Table.Row>
              <Table.Cell width={3} textAlign="right">
                <strong>Nom</strong>
              </Table.Cell>
              <Table.Cell width={10}>
                <strong>N° de compte (addresse)</strong>
              </Table.Cell>
              <Table.Cell width={3}>
                <strong>Balance</strong>
              </Table.Cell>
            </Table.Row>
            {accounts.map(account => (
              <Table.Row key={account.address}>
                <Table.Cell width={3} textAlign="right">
                  {account.meta.name}
                </Table.Cell>
                <Table.Cell width={10}>
                  <span style={{ display: 'inline-block', minWidth: '31em' }}>
                    {account.address}
                  </span>
                  <CopyToClipboard text={account.address}>
                    <Button
                      basic
                      circular
                      compact
                      size="mini"
                      color="blue"
                      icon="copy outline"
                    />
                  </CopyToClipboard>
                  <Popup 
                  content={
                    <Segment basic textAlign={"center"}>

                    <div className="qr-popup centered">
                  <h5>Présentez ce code pour recevoir des fonds depuis un client mobile</h5>
                  <p><Icon name="arrow down" size="big" color="blue" /></p>
                  <QRCode value={account.address} />
                    </div>
                  </Segment>
                }
                  
                  
                  on='click'
                  pinned
                  trigger={
                    <Button
                      basic
                      circular
                      compact
                      size="mini"
                      color="green"
                      icon="qrcode"
                    />
                  } />

                </Table.Cell>
                <Table.Cell width={3}>
                  {balances &&
                    balances[account.address] &&
                    balances[account.address]}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Grid.Column>
  )
}
