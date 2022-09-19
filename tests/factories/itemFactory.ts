import {faker} from '@faker-js/faker';

export default async function itemFactory() {
    return {
        title: faker.lorem.words(2),
        url: faker.internet.url(),
        description: faker.lorem.paragraphs(1),
        amount: 50
    }
}