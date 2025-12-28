import { fetchCustomerData } from '@/lib/auth/fetch-customer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
export interface ShopifyImage {
    url: string;
}

export interface ShopifyVariant {
    image?: ShopifyImage | null;
}

export interface ShopifyLineItem {
    title: string;
    quantity: number;
    variant?: ShopifyVariant | null;
}

export interface ShopifyLineItemEdge {
    node: ShopifyLineItem;
}

export interface ShopifyOrder {
    id: string;
    orderNumber: number;
    processedAt: string;
    fulfillmentStatus?: string | null;
    totalPrice: {
        amount: string;
        currencyCode: string;
    };
    lineItems: {
        edges: ShopifyLineItemEdge[];
    };
}


async function getOrders() {
    const cookieStore = await cookies();
    const token = cookieStore.get('customer_access_token')?.value;

    if (!token) {
        redirect('/account/login?return_to=/account/orders');
    }

    const query = `
    query {
      customer {
        orders(first: 20) {
          edges {
            node {
              id
              orderNumber
              processedAt
              financialStatus
              fulfillmentStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                    variant {
                      image {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

    try {
        const data = await fetchCustomerData(query);
        return data.data.customer.orders.edges;
    } catch (error) {
        redirect('/account/login');
    }
}

export default async function OrdersPage() {
    const orders = await getOrders();

    return (
        <div className="orders-page">
            <h1>Your Orders</h1>

            {orders.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't placed any orders yet.</p>
                    <a href="/products" className="btn-primary">Start Shopping</a>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(({ node: order }: { node: ShopifyOrder }) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <h3>Order #{order.orderNumber}</h3>
                                <span className="order-date">
                                    {new Date(order.processedAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="order-status">
                                <span className="status-badge">{order.fulfillmentStatus || 'Pending'}</span>
                                <span className="order-total">
                                    {order.totalPrice.amount} {order.totalPrice.currencyCode}
                                </span>
                            </div>

                            <div className="order-items">
                                {order.lineItems.edges.map(({ node: item }) => (
                                    <div key={item.title} className="order-item">
                                        {item.variant?.image && (
                                            <img src={item.variant.image.url} alt={item.title} width={50} />
                                        )}
                                        <div>
                                            <p>{item.title}</p>
                                            <p className="item-qty">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <a href={`/account/orders/${order.id.split('/').pop()}`} className="view-details">
                                View Details →
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
