// lib/customer-queries.js

export async function getCustomer(accessToken: string) {
  const response = await fetch('https://shopify.com/97977303354/account/customer/api/2024-10/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      query: `
        query {
          customer {
            id
            email
            firstName
            lastName
            phone
            defaultAddress {
              address1
              city
              country
              zip
            }
          }
        }
      `
    })
  });

  return await response.json();
}

export async function getCustomerOrders(accessToken: string) {
  const response = await fetch('https://shopify.com/97977303354/account/customer/api/2024-10/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      query: `
        query {
          customer {
            orders(first: 10) {
              edges {
                node {
                  id
                  orderNumber
                  totalPrice {
                    amount
                    currencyCode
                  }
                  fulfillmentStatus
                }
              }
            }
          }
        }
      `
    })
  });

  return await response.json();
}
