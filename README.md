![Logo](https://ipfs.io/ipfs/bafkreiaxw3242kpiwgxqtott34aaj35k3rvczclm7tmy4syidgepavku4q)


## Video Demo
[![Demo Video](https://github.com/user-attachments/assets/5b0890c7-d348-4ee5-ade9-726052353d90)](https://drive.google.com/file/d/1WWDhlnjKcJUyTCInZFGkoVC5QnZmIHj4/view?usp=drive_link)

# Manga Website

## Giới thiệu

MeTruyen là một website người đọc có thể đọc truyện và Admin có thể quản lý các manga. Hệ thống tích hợp công nghệ blockchain và IPFS để lưu trữ nội dung và lịch sử cập nhật manga. 

## Tính năng chính

- **Quản lý người dùng**: Đăng ký, đăng nhập, phân quyền
- **Quản lý truyện manga**: Tạo, cập nhật, xóa, tìm kiếm truyện **(Manga khi mới được tạo thì sẽ ở chế bộ không công khai)**
- **Quản lý chapter**: Thêm, sửa, xóa chapter của truyện
- **Lưu trữ phi tập trung**: Sử dụng IPFS (Pinata) để lưu trữ hình ảnh
- **Tích hợp blockchain**: Lưu trữ thông tin truyện trên blockchain
- **Đọc manga và tìm kiếm**: Người dùng có thể tìm kiếm và đọc manga mà mình yêu thích
- **Hệ thống bình luận**: Cho phép người dùng bình luận về truyện
- **Quản lý yêu thích**: Người dùng có thể đánh dấu truyện yêu thích
- **Theo dõi tiến độ đọc**: Lưu lại chapter đang đọc của người dùng
- **Quản lý báo cáo lỗi**: Người dùng có thể báo cáo lỗi một chương truyện và Admin sẽ quản lý nó
- **Phân quyền**: Attribute-Based Access Control (ABAC)
## Công nghệ sử dụng

**Frontend:**
- **Framework** - React framework
- **Styling** - Tailwind CSS
- **UI components** - Shadcn UI

**Backend:**

- **Framework**: NestJS
- **Database**: MySQL với Sequelize ORM
- **Caching**: Redis
- **File Storage**: IPFS (Pinata)
- **Blockchain**: Ethereum (Web3)
## Yêu cầu hệ thống

- Node.js (>= 18.x)
- MySQL
- Redis
- NPM
## Cài đặt cho frontend
### Các bước cài đặt

- Clone repository:
```bash
git clone https://github.com/nvdung18/metruyen.github.io.git
cd client
```

- Cài đặt dependencies:
```bash
npm install
```

- Tạo file .env từ file .env.example và cấu hình các biến môi trường:
```bash
cp .env.example .env.local
```

- Sau đó, run client:

```bash
npm run dev
```

### Client Environment Variables

Để chạy dự án này, bạn sẽ cần thêm các biến môi trường sau vào tệp **.env.local** của mình

- Cấu hình các biến môi trường trong file **.env.local**:
- Xem chi tiết hơn trong **.env.example**

```
NODE_ENV = 'Your env'
NEXT_PUBLIC_API_URL_BACKEND = 'URL for the backend API'

# Thêm IPFS gateway cho NEXT_PUBLIC_API_URL_IPFS 
NEXT_PUBLIC_API_URL_IPFS = 'https://gateway.pinata.cloud/ipfs/' (gateway nên dùng)

# Thêm một IPFS gateway cho NEXT_PUBLIC_ALTERNATE_URL_IPFS để thay thế nếu gateway phía trên có lỗi
NEXT_PUBLIC_ALTERNATE_URL_IPFS= 'https://ipfs.io/ipfs/' (gateway nên dùng)

# Your API key of Pinata
NEXT_PUBLIC_PINATA_JWT = 'Your pinata jwt"

# ? Để lấy RPC_URL, bạn có thể tạo tài khoản trên Alchemy, Infura hoặc nút cục bộ của bạn như Ganache
RPC_URL = 'Your rpc url'
```
## Cài đặt cho backend

### Các bước cài đặt

- Clone repository:
```bash
git clone https://github.com/nvdung18/metruyen.github.io.git
cd server
```

- Cài đặt dependencies:
```bash
npm install
```

- Tạo file .env từ file .env.example và cấu hình các biến môi trường:
```bash
cp .env.example .env
```

- Khởi động ứng dụng:
```bash
# Development
npm run start:dev

# Production
npm run start:prod
```
### Server Environment Variables

Để chạy dự án này, bạn sẽ cần thêm các biến môi trường sau vào tệp **.env** của mình

- Cấu hình các biến môi trường trong file .env:
- Xem chi tiết hơn trong .env.example
```
PORT='your port'
NODE_ENV='your env'

# DB
DB_DIALECT='your type of db'
DB_HOST='your db host'
DB_PORT='your db port'
DB_USERNAME='your db user name'
DB_PASSWORD='your db pass'
DB_NAME_DB='your db name'

# REDIS
REDIS_URL='your redis url'

# PINATA
PINATA_JWT='your pinata jwt'
PINATA_GATEWAY_URL='your pinata gateway url'

# Web3
    # ? Để lấy RPC_URL, bạn có thể tạo một tài khoản trên Alchemy, Infura hoặc nút cục bộ của bạn như Ganache
    # ? YOUR_PRIVATE_KEY là khóa riêng của tài khoản (ví của bạn)
    # ? FACTORY_CONTRACT_ADDRESS là địa chỉ của hợp đồng factory đã triển khai
RPC_URL='your rpc url'
YOUR_PRIVATE_KEY='your private key'
FACTORY_CONTRACT_ADDRESS='your factory contract address'
```

### Cấu trúc dự án

```
src/
├── common/              # Các utility và constants dùng chung
├── configs/             # Cấu hình ứng dụng
├── databases/           # Các thiết lập khác dành cho các loại database  
├── modules/             # Các module chức năng
│   ├── auth/            # Xác thực người dùng
│   ├── category/        # Quản lý thể loại truyện
│   ├── chapter/         # Quản lý chapter
│   ├── comment/         # Quản lý bình luận
│   ├── error-report/    # Báo cáo lỗi
│   ├── favorite/        # Quản lý truyện yêu thích
│   ├── manga/           # Quản lý truyện manga
│   ├── user/            # Quản lý người dùng
├── shared/              # Các thành phần dùng chung
└── main.ts              # Entry point
```
## API Documentation

Sau khi khởi động ứng dụng, bạn có thể truy cập Swagger UI để xem tài liệu API tại:

```
http://localhost:{PORT}/api
```
## Database

Dự án sử dụng MySQL làm cơ sở dữ liệu chính và Sequelize làm ORM. Dưới đây là các bước để thiết lập và triển khai cơ sở dữ liệu cho dự án.

### 1. Cài đặt MySQL

- Tải và cài đặt MySQL 
- Làm theo hướng dẫn cài đặt và thiết lập mật khẩu root

### 2. Cấu hình kết nối cơ sở dữ liệu

Cập nhật thông tin kết nối trong file `.env`:

```
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=manga_user
DB_PASSWORD=your_strong_password
DB_NAME_DB=manga_db
```

### 3. Sử dụng Sequelize Migrations

Dự án sử dụng Sequelize Migrations để quản lý cấu trúc cơ sở dữ liệu. Các file migration được lưu trong thư mục `src/databases/sequelize/migrations`.

#### Chạy migrations để tạo cấu trúc bảng:

```bash
npx sequelize-cli db:migrate
```

#### Hoàn tác migration cuối cùng:

```bash
npx sequelize-cli db:migrate:undo
```

#### Hoàn tác tất cả migrations:

```bash
npx sequelize-cli db:migrate:undo:all
```

### 4. Sử dụng Seeders để tạo dữ liệu mẫu

Nếu bạn muốn có dữ liệu mẫu cho ứng dụng thì **Seeders** giúp tạo dữ liệu mẫu cho ứng dụng. Các file seeder được lưu trong thư mục `src/databases/sequelize/seeders`. (Dữ liệu content trong manga, chapter của các seed là dữ liệu mẫu nên sẽ không chính xác).

#### Chạy tất cả seeders:

```bash
npx sequelize-cli db:seed:all
```

#### Hoàn tác seeder cuối cùng:

```bash
npx sequelize-cli db:seed:undo
```

#### Hoàn tác tất cả seeders:

```bash
npx sequelize-cli db:seed:undo:all
```

### 5. Tạo migration và seeder mới

#### Tạo migration mới:

```bash
npx sequelize-cli migration:generate --name create-new-table
```

#### Tạo seeder mới:

```bash
npx sequelize-cli seed:generate --name demo-data
```

## Tài khoản test
- Sau khi chạy xong migration và seeder chúng ta sẽ có 2 tài khoản là user và admin để test
    * User account: 
        ```bash
        account: user123@example.com
        password: user123
        ```
    * Admin account
        ```bash
        account: admin123@gmail.com
        password: admin123
        ```

## Caching

Dự án sử dụng Redis để cache dữ liệu. Đảm bảo Redis được cấu hình đúng trong file `.env`:

```
example: REDIS_URL=redis://localhost:6379
```
## Blockchain

### Triển khai và tương tác với Smart Contracts sử dụng Remix IDE

[Remix IDE](https://remix.ethereum.org/) là một công cụ phát triển trực tuyến cho phép bạn viết, triển khai và tương tác với smart contracts mà không cần cài đặt bất kỳ phần mềm nào trên máy tính của bạn.

#### Bước 1: Truy cập Remix IDE

Mở trình duyệt và truy cập [https://remix.ethereum.org/](https://remix.ethereum.org/)

#### Bước 2: Tạo và biên dịch các smart contracts

Tạo file `Factory.sol`:
   - Nhấp vào biểu tượng "Create New File" trong tab File Explorer
   - Đặt tên file là `Factory.sol`
   - Sao chép nội dung từ file `server\src\shared\web3\contracts\factory.sol` vào

Tạo file `Owner.sol`:
   - Tạo file mới và đặt tên là `Owner.sol`
   - Sao chép nội dung từ file `server\src\shared\web3\contracts\owner.sol` vào

Tạo file `CIDStorage.sol`:
   - Tạo file mới và đặt tên là `CIDStorage.sol`
   - Sao chép nội dung từ file `server\src\shared\web3\contracts\CIDStorage.sol` vào

Biên dịch các contracts:
   - Chuyển sang tab "**Solidity Compiler**" 
    Nếu bạn sài Ganache giống tôi thì hãy vào "Advanced Configurations".
    Trong  "Compiler configuration" vào phần "EVM Version" và chọn "istanbul"
   - Nhấp vào nút "Compile" cho từng file

#### Bước 3: Triển khai các contracts

3.1. Triển khai Factory contract:
   - Chọn contract "Factory"
   - Chuyển sang tab "Deploy & Run Transactions"
   - Chọn môi trường triển khai (Injected Provider - MetaMask hoặc mạng testnet khác)
   - Nhấp vào nút "Deploy"
   - **Lưu lại địa chỉ Factory contract** hiển thị trong phần "Deployed Contracts"

3.2. Triển khai Owner contract:
   - Chọn contract "Owner"
   - Nhập địa chỉ Factory contract vào trường constructor
   - Nhấp vào nút "Deploy"

3.3. Triển khai CIDStorage contract:
   - Chọn contract "CIDStorage"
   - Nhập địa chỉ Factory contract vào trường constructor
   - Nhấp vào nút "Deploy"

#### Bước 4: Kiểm tra các contracts đã triển khai

4.1. Kiểm tra Factory contract:
   - Mở Factory contract trong phần "Deployed Contracts"
   - Gọi hàm `getContractByName` với tham số "Owner" để kiểm tra địa chỉ Owner contract
   - Gọi hàm `getContractByName` với tham số "CIDStorage" để kiểm tra địa chỉ CIDStorage contract

4.2. Kiểm tra Owner contract:
   - Mở Owner contract trong phần "Deployed Contracts"
   - Gọi hàm `getOwner` để kiểm tra địa chỉ chủ sở hữu

#### Bước 5: Cấu hình trong ứng dụng NestJS

5.1. Cập nhật file `.env` với địa chỉ của Factory contract:

```
FACTORY_CONTRACT_ADDRESS='0x...' # Địa chỉ Factory contract từ Remix
RPC_URL='your_rpc_url' # URL của mạng bạn đã triển khai
YOUR_PRIVATE_KEY='your_private_key' # Private key của ví đã triển khai contracts
```

### Phương pháp triển khai thay thế

Ngoài việc sử dụng Remix IDE, bạn có thể triển khai smart contracts bằng nhiều phương pháp khác tùy theo nhu cầu và kinh nghiệm của mình:

#### 1. Sử dụng Hardhat, Truffle

Là các framework phát triển Ethereum phổ biến, cung cấp nhiều tính năng mạnh mẽ cho việc phát triển, kiểm thử và triển khai smart contracts.

#### 2. Sử dụng thư viện ethers.js hoặc web3.js

Bạn có thể viết script triển khai tùy chỉnh bằng ethers.js hoặc web3.js.

```javascript
// Ví dụ với ethers.js
const { ethers } = require("ethers");
const fs = require("fs");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  
  // Đọc ABI và bytecode
  const factoryArtifact = JSON.parse(fs.readFileSync("./artifacts/Factory.json"));
  
  // Triển khai Factory
  const Factory = new ethers.ContractFactory(
    factoryArtifact.abi,
    factoryArtifact.bytecode,
    wallet
  );
  const factory = await Factory.deploy();
  await factory.deployed();
  
  console.log("Factory deployed to:", factory.address);
}

main();
```