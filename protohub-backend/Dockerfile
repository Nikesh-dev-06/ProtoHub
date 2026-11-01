FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./ 

# Install dependencies
RUN npm ci

# Copy source code and prisma schema
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# --- Production Image ---
FROM node:20-alpine

WORKDIR /app

# Copy node_modules, build artifacts and prisma from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./

# We must re-run prisma generate in the prod image if we only copied the schema, 
# or rely on the one in node_modules/.prisma from builder. 
# Copying node_modules directly is fine for identical OS (alpine -> alpine).

# Expose port
EXPOSE 4000

# Start the application. For sqlite, the db file should be mounted as a volume if persistent.
CMD ["npm", "run", "start:prod"]
