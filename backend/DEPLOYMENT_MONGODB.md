# MongoDB Deployment Configuration

## Connection String

Use this connection string format:

```
mongodb+srv://svnglobal:<db_password>@svnglobal.5vlys7w.mongodb.net/?appName=svnglobal
```

## Actual Connection String

Replace `<db_password>` with `Svnglobal%402025` (URL encoded version of `Svnglobal@2025`):

```
mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal
```

## Environment Variable

Set the `MONGODB_URI` environment variable in your deployment:

```bash
MONGODB_URI=mongodb+srv://svnglobal:Svnglobal%402025@svnglobal.5vlys7w.mongodb.net/svnglobal?retryWrites=true&w=majority&appName=svnglobal
```

## MongoDB Atlas Configuration

1. **Database User:**
   - Username: `svnglobal`
   - Password: `Svnglobal@2025`

2. **Network Access:**
   - Add your server IP to MongoDB Atlas Network Access
   - Or use `0.0.0.0/0` for all IPs (less secure)

3. **Database Name:**
   - Database: `svnglobal`

4. **Collections:**
   - `admin` - Admin credentials
   - `products` - Product catalog
   - `testReports` - Test reports and certifications

## Notes

- The `@` symbol in the password must be URL encoded as `%40`
- The connection string includes the database name (`svnglobal`) after the host
- Connection options: `retryWrites=true&w=majority` for better reliability

