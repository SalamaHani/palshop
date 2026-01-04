import { Image } from "./shopify-graphql";

export interface MenuItem {
    id: string;
    title: string;
    url: string;
    resourceId?: string;
    resource?: {
        id: string;
        handle: string;
        title: string;
        image?: Image;
    };
    items?: MenuItem[];
}

export interface Menu {
    id: string;
    title: string;
    items: MenuItem[];
}

export interface GetMenuQuery {
    menu: Menu;
}

export interface GetMenuQueryVariables {
    handle: string;
}
