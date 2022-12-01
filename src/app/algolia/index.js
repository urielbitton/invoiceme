import algoliasearch from "algoliasearch"

const algolia_app_id = process.env.REACT_APP_ALGOLIA_APP_ID
const algolia_admin_key = process.env.REACT_APP_ALGOLIA_ADMIN_KEY

export const algoliaSearchClient = algoliasearch(
  algolia_app_id,
  algolia_admin_key
)


export const invoicesIndex = algoliaSearchClient.initIndex('invoices_index')
export const estimatesIndex = algoliaSearchClient.initIndex('estimates_index')
export const contactsIndex = algoliaSearchClient.initIndex('contacts_index')
export const settingsIndex = algoliaSearchClient.initIndex('settings_index')