require('dotenv').config()
const { GoogleSpreadsheet } = require('google-spreadsheet')
// const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
// console.log(sheet.title);
// console.log(sheet.rowCount);
const keyFile = {
  type: 'service_account',
  project_id: 'bajour',
  private_key_id: process.env.GOOGLE_PRIVAT_KEY_ID,
  private_key: process.env.GOOGLE_PRIVAT_KEY.replace(/\\n/g, '\n') || null,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/gsheets-api-service-user%40bajour.iam.gserviceaccount.com',
}

exports.handler = async (req) => {
  //   if (!req.queryStringParameters.id) {
  //     return {
  //       statusCode: 200,
  //       headers: {
  //         'Content-Type': 'application/json; charset=utf-8',
  //         // 'Access-Control-Allow-Origin': '*',
  //         // 'Access-Control-Allow-Headers': 'Content-Type',
  //         'Access-Control-Allow-Methods': 'GET',
  //       },
  //       body: null,
  //     }
  //   }
  const sheetID = '1-1HagCrMzpjq3ghA54iF4pnG4Oe0X36vMDw0cS9N3R8'
  async function accessSpreadsheet() {
    console.log('hallo')
    // spreadsheet key is the long id in the sheets URL
    // https://drive.google.com/file/d/1GrQ1MvN44TGKp9x_pRgnpQibkl3ZQH-v/view?usp=sharing
    const doc = await new GoogleSpreadsheet(sheetID)
    await doc.useServiceAccountAuth(keyFile)
    await doc.loadInfo() // loads document properties and worksheets

    const sheet = await doc.sheetsByIndex[0] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    return await sheet.getRows()
  }
  const filter = req.queryStringParameters.filter || null
  const r = await accessSpreadsheet()
  const to = []
  if ((r && !filter) || filter === 'null') {
    await r.forEach((e) => {
      const stObj = {}
      const nObj = {}
      // find matrix
      const cats = Object.keys(e).filter(
        (y) => y.includes('kat:') && parseInt(e[y]) === 1
      )
      // find matrix non kat: values for tooltip an filters
      const nonCats = Object.keys(e).filter(
        (y) =>
          !y.includes('kat:') &&
          !y.startsWith('_') &&
          !y.includes('json') &&
          !y.includes('egrid') &&
          !y.includes('Egrid')
      )
      nonCats.forEach((m) => {
        Object.assign(nObj, { [m]: e[m], ...nObj })
      })
      // threat matrix
      cats.forEach((f) => {
        const fin =
          f.replace(/kat:/gi, '').split(':') || nonCats.filter((e) => e) || []
        fin.forEach(() => {
          Object.assign(stObj, {
            // Owner aka Eigentümer from table header
            [fin[0]]: fin[1],
            styles: {
              color:
                fin[2] ||
                '#' + Math.floor(Math.random() * 16777215).toString(16),
            },
            ...stObj,
          })
        })
      })
      // push to response object
      to.push({
        ...stObj,
        ...nObj,
        json: e.json ? e.json.replace(/\s+/g, '') : [] || [],
      })
    })
  }
  // else if (r && !!filter) {
  //   // @todo make dynamic
  //   const field =
  //     (filter.includes(':') ? filter.split(':')[0] : 'Eigentuemer') ||
  //     'Eigentuemer'
  //   const v = (filter.includes(':') ? filter.split(':')[1] : filter) || filter
  //   console.log(v)
  //   await r
  //     .filter((e) =>
  //       field === 'Gebaeudeadressen' || field === 'Eigentuemer'
  //         ? e[field].includes(v)
  //         : e[field] === v
  //     )
  //     .forEach((e) => {
  //       to.push({
  //         Egrid: e.Egrid,
  //         Flaeche: e.Flaeche,
  //         Herkunft: e.Herkunft,
  //         Land: e.Land,
  //         Gebaeudeadressen: e.Gebaeudeadressen,
  //         area: e.Quartier || null,
  //         urb: e.Wohnviertel || null,
  //         json: e.json ? e.json.replace(/\s+/g, '') : [] || [],
  //       })
  //     })
  // }
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(to),
  }
}
