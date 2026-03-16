const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Seeding database...');

    const password = await bcrypt.hash('password123', 10);

    // Create users
    const speaker = await prisma.user.upsert({
        where: { email: 'speaker@example.com' },
        update: {},
        create: {
            email: 'speaker@example.com',
            password,
            name: 'John Speaker',
            role: 'SPEAKER'
        }
    });

    const reviewer = await prisma.user.upsert({
        where: { email: 'reviewer@example.com' },
        update: {},
        create: {
            email: 'reviewer@example.com',
            password,
            name: 'Jane Reviewer',
            role: 'REVIEWER'
        }
    });

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            password,
            name: 'Admin User',
            role: 'ADMIN'
        }
    });

    console.log('Users created');

    // Create tags
    const tags = await Promise.all([
        prisma.tag.upsert({
            where: { name: 'Technology' },
            update: {},
            create: { name: 'Technology' }
        }),
        prisma.tag.upsert({
            where: { name: 'Health' },
            update: {},
            create: { name: 'Health' }
        }),
        prisma.tag.upsert({
            where: { name: 'Business' },
            update: {},
            create: { name: 'Business' }
        })
    ]);

    console.log('Tags created');

    // Create proposals
    const proposals = await Promise.all([
        
        prisma.proposal.create({
            data: {
                title: 'Lorem ipsum dolor sit amet',
                description: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
                status: 'APPROVED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Technology' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Sed ut perspiciatis unde omnis',
                description: 'Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto.',
                status: 'PENDING',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Technology' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'At vero eos et accusamus et iusto',
                description: 'Odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.',
                status: 'REJECTED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Technology' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Excepteur sint occaecat cupidatat',
                description: 'Non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate velit.',
                status: 'PENDING',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Technology' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Nemo enim ipsam voluptatem quia',
                description: 'Voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                status: 'APPROVED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Technology' } } }] }
            }
        }),

        
        prisma.proposal.create({
            data: {
                title: 'Neque porro quisquam est qui dolorem',
                description: 'Ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam.',
                status: 'PENDING',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Health' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Quis autem vel eum iure reprehenderit',
                description: 'Qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.',
                status: 'APPROVED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Health' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Ut enim ad minima veniam quis nostrum',
                description: 'Exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit.',
                status: 'REJECTED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Health' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Duis aute irure dolor in reprehenderit',
                description: 'In voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
                status: 'PENDING',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Health' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Sed ut perspiciatis unde omnis iste',
                description: 'Natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.',
                status: 'APPROVED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Health' } } }] }
            }
        }),

        


        prisma.proposal.create({
            data: {
                title: 'Lorem ipsum dolor sit amet consectetur',
                description: 'Adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
                status: 'PENDING',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Business' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Excepteur sint occaecat cupidatat non',
                description: 'Proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Duis aute irure dolor in reprehenderit in voluptate.',
                status: 'APPROVED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Business' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'At vero eos et accusamus et iusto odio',
                description: 'Dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint.',
                status: 'REJECTED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Business' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Nemo enim ipsam voluptatem quia voluptas',
                description: 'Sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
                status: 'PENDING',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Business' } } }] }
            }
        }),
        prisma.proposal.create({
            data: {
                title: 'Neque porro quisquam est qui dolorem',
                description: 'Ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore.',
                status: 'APPROVED',
                speakerId: speaker.id,
                tags: { create: [{ tag: { connect: { name: 'Business' } } }] }
            }
        })
    ]);

    console.log(`Created ${proposals.length} sample proposals`);

    // Add 2 reviews
    await prisma.review.create({
        data: {
            rating: 5,
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
            proposalId: proposals[0].id,
            reviewerId: reviewer.id
        }
    });

    await prisma.review.create({
        data: {
            rating: 3,
            comment: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Duis aute irure dolor in reprehenderit.',
            proposalId: proposals[5].id,
            reviewerId: reviewer.id
        }
    });

    console.log('Reviews created');
    console.log('Seeding complete!');
}

main()
    .catch(e => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });