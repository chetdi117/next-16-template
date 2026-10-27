# FRONTEND AI CODING RULES

## 1. Technology Stack

This project uses:

- React.js
- Next.js 16
- TypeScript
- Ant Design 6
- TanStack React Query
- Axios
- Redux Toolkit
- Day.js
- SCSS / CSS Modules
- pnpm

The AI MUST follow the existing project architecture and conventions.

Do NOT introduce another library or architecture unless explicitly requested.

---

# 2. CRITICAL AI RULES

## 2.1 Do NOT continuously scan the project

The AI MUST NOT repeatedly read or scan the entire project.

When project information has already been inspected, reuse the existing context.

Only inspect additional files when:

- the required information is missing
- the existing implementation is unclear
- the requested change depends on another file
- there is a type/API dependency that must be verified

Do NOT repeatedly inspect the same files without a reason.

---

## 2.2 Graphify / Project Code Reading

When Graphify or another project-code browsing tool is available:

1. Read only the files required for the current task.
2. Start from the target page/component.
3. Follow imports only when necessary.
4. Do NOT recursively read the entire dependency tree.
5. Do NOT repeatedly re-read files that were already inspected.
6. Reuse information obtained from previous Graphify reads.
7. Avoid opening large files when only a small section is required.
8. Prefer searching for a symbol/function/type instead of reading unrelated files.
9. Do not scan every page to understand one page.
10. Do not scan every service when only one API service is required.

### Preferred investigation flow

```text
Task
 ↓
Target Page
 ↓
Target Component
 ↓
Related Hook
 ↓
Related Service
 ↓
Related Model/Type
```

Stop reading once enough information is available to implement the task.

### DO NOT do this

```text
Read entire project
 ↓
Read every page
 ↓
Read every component
 ↓
Read every service
 ↓
Read every utility
 ↓
Read entire project again
```

This wastes tokens and provides little value.

---

# 3. Minimal Context Principle

Before changing code, determine the smallest set of files required.

Example:

If the task is:

```text
Add product search to ProductPage
```

The AI should normally inspect:

```text
ProductPage
ProductSearch component
Product hook
Product service
Product model/type
```

It should NOT automatically inspect:

```text
OrderPage
UserPage
PaymentPage
all Redux slices
all services
all utilities
```

unless they are actually related.

---

# 4. Project Architecture

Use the following conceptual architecture:

```text
Page
 │
 ├── Smart Component
 │      │
 │      ├── Hook
 │      │    ├── React Query
 │      │    ├── Redux
 │      │    └── Business/UI state
 │      │
 │      └── Dumb Components
 │
 ├── Services
 │      │
 │      └── Axios
 │
 ├── Models / Types
 │
 └── Utils
```

The responsibilities MUST remain separated.

---

# 5. Page Structure

Pages should primarily compose the screen.

Example:

```text
app/
└── products/
    ├── page.tsx
    ├── components/
    │   ├── ProductPage.tsx
    │   ├── ProductTable.tsx
    │   ├── ProductFilter.tsx
    │   └── ProductForm.tsx
    │
    ├── hooks/
    │   └── useProductPage.ts
    │
    ├── services/
    │   └── product.service.ts
    │
    ├── models/
    │   └── product.model.ts
    │
    └── utils/
        └── product.utils.ts
```

Do not put all logic inside `page.tsx`.

---

# 6. Smart Components

Smart Components are responsible for:

- fetching data
- React Query
- Redux state
- event handling
- coordinating child components
- page-level business logic
- transforming data when required

Example:

```tsx
function ProductPage() {
  const { data, isLoading } = useProducts();

  const handleCreate = () => {
    // ...
  };

  return (
    <>
      <ProductFilter />
      <ProductTable
        data={data?.items ?? []}
        loading={isLoading}
      />
    </>
  );
}
```

Smart Components may contain application logic.

However, avoid making them unnecessarily large.

If logic becomes reusable or complex, move it into a hook/service/utils.

---

# 7. Dumb Components

Dumb Components / Presentational Components should focus on rendering UI.

They should preferably receive data and callbacks through props.

Example:

```tsx
interface ProductTableProps {
  data: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
}

export function ProductTable({ data, loading, onEdit }: ProductTableProps) {
  return (
    <Table
      dataSource={data}
      loading={loading}
    />
  );
}
```

Dumb Components SHOULD NOT:

- call APIs directly
- contain business rules
- access Redux directly unless necessary
- create Axios requests
- contain complicated data fetching logic

Prefer:

```text
Smart Component
      ↓
Dumb Component
```

instead of:

```text
Page
 ↓
Every child component independently calls API
```

---

# 8. Hooks

Hooks contain reusable React-related logic.

Examples:

```text
hooks/
├── useProducts.ts
├── useProductForm.ts
├── useProductPermission.ts
└── useProductPage.ts
```

Use hooks for:

- React Query
- Redux selectors
- UI state
- browser/client behavior
- reusable React logic

Do NOT create a hook just to wrap a trivial function.

Bad:

```ts
const useFormatName = () => {
  return (name: string) => name.trim();
};
```

Use a utility instead.

---

# 9. React Query

React Query is responsible for SERVER STATE.

Use React Query for:

- GET requests
- API data
- caching
- pagination
- mutations
- refetching
- optimistic updates

Architecture:

```text
Component
 ↓
Hook
 ↓
React Query
 ↓
Service
 ↓
Axios
 ↓
API
```

Example:

```ts
export const useProducts = (params: ProductQueryParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};
```

Do NOT call Axios directly inside components.

---

# 10. Redux Toolkit

Redux Toolkit is responsible for CLIENT / APPLICATION STATE.

Use Redux for:

- global UI state
- application settings
- selected context
- client-side workflow state
- state that must be shared globally

Do NOT use Redux as a replacement for React Query.

Use:

```text
React Query
→ Server state

Redux Toolkit
→ Client/application state
```

Avoid storing the same API response in both Redux and React Query unless there is a clear reason.

---

# 11. Axios

Axios requests MUST be centralized.

Preferred:

```text
services/
├── api-client.ts
├── product.service.ts
├── order.service.ts
└── user.service.ts
```

Example:

```ts
export const productService = {
  getProducts(params: ProductQueryParams) {
    return apiClient.get<ProductListResponse>('/products', { params });
  },
};
```

Do NOT do this:

```tsx
function ProductPage() {
  axios.get('/products');
}
```

Prefer:

```tsx
const { data } = useProducts(params);
```

---

# 12. Services

Services are responsible for communicating with APIs.

Services SHOULD contain:

- Axios requests
- API endpoint definitions
- request parameters
- response types
- API-specific transformations when necessary

Services SHOULD NOT contain:

- React hooks
- JSX
- UI logic
- Ant Design logic
- page navigation
- component state

Example:

```text
services/
└── product.service.ts
```

```ts
export const productService = {
  getProducts(params: ProductQueryParams) {
    return apiClient.get<ProductListResponse>('/products', { params });
  },

  getProduct(id: number) {
    return apiClient.get<Product>(`/products/${id}`);
  },
};
```

---

# 13. Models / Types

Models contain domain/API types.

Example:

```text
models/
└── product.model.ts
```

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface ProductQueryParams {
  page: number;
  pageSize: number;
  keyword?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
}
```

Do NOT redefine the same interface in multiple components.

Prefer importing the existing model.

---

# 14. Where Models Should Live

Use this rule:

## Shared model

If used by multiple pages/features:

```text
src/
└── models/
    └── product.model.ts
```

## Feature-specific model

If only used by one page/feature:

```text
products/
└── models/
    └── product.model.ts
```

Do NOT move every small type into global models.

Keep feature-specific types close to the feature.

---

# 15. Utils

There are TWO levels of utilities.

## 15.1 Global Utils

Use:

```text
src/
└── utils/
```

for functions used across multiple features.

Examples:

```text
utils/
├── date.ts
├── number.ts
├── string.ts
├── validation.ts
└── object.ts
```

Examples:

```ts
formatCurrency();
formatDate();
isEmpty();
debounce();
```

A global utility SHOULD be generic and reusable.

---

## 15.2 Page / Feature Utils

If a utility is only related to one feature:

```text
products/
└── utils/
    ├── product.utils.ts
    └── product.mapper.ts
```

Do NOT put feature-specific functions into global `src/utils`.

Example:

```ts
export function mapProductTableData(products: Product[]) {
  // product-specific transformation
}
```

This belongs inside:

```text
products/utils/
```

not:

```text
src/utils/
```

### Rule

```text
Used by many features
→ global utils

Used by one page/feature
→ feature/page utils
```

---

# 16. Do Not Create "God Utils"

Do NOT create:

```text
utils/
└── common.ts
```

containing hundreds of unrelated functions.

Prefer:

```text
utils/
├── date.ts
├── number.ts
├── string.ts
├── validation.ts
└── object.ts
```

Keep utilities focused.

---

# 17. Business Logic Location

Use the following decision:

```text
React-specific logic
→ hooks

API communication
→ services

API/domain types
→ models

Reusable pure function
→ utils

UI rendering
→ components

Page orchestration
→ smart component/page

Server state
→ React Query

Global client state
→ Redux Toolkit
```

Do not put everything into `utils`.

---

# 18. TypeScript

The project uses TypeScript.

## NEVER use `any`

Forbidden:

```ts
const data: any = {};
```

```ts
const data = value as any;
```

```ts
function test(value: any) {}
```

Do NOT use:

```ts
@ts-ignore
```

unless absolutely necessary.

Prefer:

```ts
unknown;
```

and type narrowing.

Example:

```ts
const data: unknown = response.data;

if (isProduct(data)) {
  // safely use data
}
```

---

# 19. Next.js 16

Use Next.js 16 App Router.

Prefer Server Components by default.

Only use:

```tsx
'use client';
```

when required.

Examples requiring Client Components:

- useState
- useEffect
- event handlers
- Redux hooks
- React Query hooks
- browser APIs
- interactive Ant Design components

Do NOT automatically add `'use client'`.

Keep the client boundary as small as possible.

---

# 20. Authentication / Authorization

Route-level authorization should be centralized.

Use Next.js 16 `proxy.ts` where appropriate for:

```text
authentication
route access
page permission
redirect
```

Example:

```text
Request
 ↓
proxy.ts
 ↓
Authentication
 ↓
Permission
 ↓
Page
```

Do NOT duplicate the same permission mapping inside every page.

However:

Frontend permission checking is NOT the final security boundary.

The backend MUST validate authorization again.

---

# 21. Page Permission

Use centralized permission mapping.

Example:

```ts
const PAGE_PERMISSIONS = {
  '/products': 'PRODUCT_VIEW',
  '/products/create': 'PRODUCT_CREATE',
  '/orders': 'ORDER_VIEW',
} as const;
```

Do NOT scatter permission strings across components.

---

# 22. Ant Design 6

Use Ant Design 6 APIs.

Prefer existing Ant Design components instead of creating custom replacements.

Examples:

```text
Form
Table
Modal
Drawer
Select
DatePicker
Upload
Tree
Cascader
Pagination
Spin
Skeleton
Empty
Result
```

Use TypeScript types for:

- Table records
- Form values
- Select options
- event handlers

Do NOT use `any` for Ant Design callbacks.

---

# 23. Ant Design Forms

Prefer Ant Design Form for complex forms.

```tsx
<Form
  form={form}
  onFinish={handleSubmit}
>
```

Do not unnecessarily combine:

```text
Form state
+
useState for every field
+
Redux
```

Use the simplest appropriate state model.

---

# 24. Day.js

Use Day.js for date/time operations.

Do NOT add Moment.js.

Avoid manual date manipulation when Day.js can safely perform the operation.

Prefer shared formatting constants when appropriate.

Example:

```ts
export const DATE_FORMAT = 'DD/MM/YYYY';

export const DATETIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';
```

---

# 25. SCSS

Use SCSS / CSS Modules for component-specific styles.

Preferred:

```text
ProductTable/
├── ProductTable.tsx
└── ProductTable.module.scss
```

Avoid unnecessary global styles.

Do not deeply override Ant Design internal DOM unless necessary.

Prefer Ant Design 6 supported:

```text
classNames
styles
design tokens
ConfigProvider
```

when available.

---

# 26. Component Folder Convention

Preferred:

```text
components/
└── ProductTable/
    ├── ProductTable.tsx
    ├── ProductTable.module.scss
    ├── ProductTable.types.ts
    └── index.ts
```

Do not create files that are not necessary.

For small components:

```text
Button.tsx
Button.module.scss
```

is enough.

---

# 27. Smart vs Dumb Component Rule

Use this distinction:

## Smart Component

Responsible for:

- data fetching
- hooks
- mutations
- Redux
- React Query
- page logic
- event coordination

Example:

```text
ProductPage
```

## Dumb Component

Responsible for:

- rendering
- layout
- visual interaction
- receiving props
- emitting callbacks

Example:

```text
ProductTable
ProductFilter
ProductCard
```

Prefer:

```text
Smart
 ↓
Dumb
```

rather than putting API logic into every UI component.

---

# 28. Do Not Over-Abstraction

Do NOT create:

```text
10 files
```

for a feature that only needs:

```text
page.tsx
component.tsx
service.ts
model.ts
```

Create an abstraction only when it provides real value.

Avoid:

- unnecessary wrappers
- unnecessary hooks
- unnecessary services
- unnecessary mappers
- unnecessary interfaces
- unnecessary folders

---

# 29. Reuse Before Creating

Before creating anything, check whether the project already has:

- component
- hook
- service
- model
- utility
- API client
- permission helper
- date helper
- validation helper

If an existing implementation can be reused, reuse it.

Do NOT create duplicates such as:

```text
formatDate()
formatDateTime()
formatDateString()
convertDate()
```

when an existing date utility already handles the requirement.

---

# 30. AI Modification Strategy

When asked to modify existing code:

### Step 1

Read the target file.

### Step 2

Identify its direct dependencies.

### Step 3

Read only the dependencies necessary to understand the change.

### Step 4

Search for an existing implementation that can be reused.

### Step 5

Make the smallest required change.

### Step 6

Do not refactor unrelated code.

### Step 7

Do not rename unrelated variables/files.

### Step 8

Do not introduce new dependencies unless necessary.

### Step 9

Verify TypeScript types.

### Step 10

Stop reading the project once enough context is available.

---

# 31. Token Efficiency

The AI MUST optimize for token usage.

Do NOT:

- repeatedly read the same file
- repeatedly inspect the same function
- scan the entire repository
- dump large files unnecessarily
- inspect unrelated pages
- inspect unrelated services
- explain unchanged code
- regenerate large sections when a small patch is sufficient

Prefer:

```text
Search
 ↓
Small relevant section
 ↓
Understand
 ↓
Modify
 ↓
Verify
```

instead of:

```text
Read everything
 ↓
Read everything again
 ↓
Analyze everything
 ↓
Modify
```

---

# 32. Graphify Reading Rule

When using Graphify:

### First read

Understand the target:

```text
Page
Component
Hook
Service
Model
```

### Subsequent reads

Only retrieve:

```text
specific symbol
specific function
specific type
specific section
```

Do NOT reopen the entire file if only one function is required.

### Context retention

Once the AI has obtained:

```text
service endpoint
request type
response type
query key
component structure
```

it SHOULD retain and reuse that information during the current task.

Do not request the same information again.

---

# 33. API Flow

The preferred API architecture is:

```text
Page
 ↓
Smart Component
 ↓
Hook
 ↓
React Query
 ↓
Service
 ↓
Axios
 ↓
.NET API
```

Example:

```text
ProductPage
    ↓
ProductContainer
    ↓
useProducts()
    ↓
productService.getProducts()
    ↓
apiClient.get()
    ↓
.NET API
```

---

# 34. Mutation Flow

Preferred:

```text
User Action
 ↓
Smart Component
 ↓
useMutation
 ↓
Service
 ↓
Axios
 ↓
.NET API
 ↓
invalidate/update React Query cache
 ↓
UI
```

Do NOT manually duplicate server state into Redux after every mutation unless there is a specific requirement.

---

# 35. Error Handling

Handle:

```text
loading
success
empty
error
```

appropriately.

Do not silently swallow errors.

Do not expose sensitive backend error details to users.

Use centralized Axios error handling where possible.

---

# 36. Performance

Do not automatically use:

```text
useMemo
useCallback
React.memo
```

Use them only when they provide meaningful value.

Prefer:

- Server Components
- small Client Components
- React Query caching
- appropriate query keys
- pagination
- debounced search
- efficient rendering

Avoid unnecessary API requests.

---

# 37. URL State

Use URL query parameters for state that should survive:

- refresh
- browser navigation
- sharing
- bookmarking

Example:

```text
/products?page=1&pageSize=20&keyword=iphone
```

Do not put everything into Redux.

---

# 38. Naming

Use:

```text
Components → PascalCase
Functions → camelCase
Variables → camelCase
Constants → UPPER_SNAKE_CASE
Types → PascalCase
Interfaces → PascalCase
```

Follow the existing repository naming convention when it differs.

Consistency is more important than introducing a new style.

---

# 39. Dependency Rule

Use `pnpm`.

Do NOT install another package if the existing stack can solve the problem.

Before adding a dependency, check:

```text
React
Next.js
Ant Design
React Query
Axios
Redux Toolkit
Day.js
SCSS
```

first.

---

# 40. Final Verification

Before finishing a task, verify:

- No `any`
- No unnecessary `'use client'`
- No duplicate API call
- No duplicate service
- No duplicate utility
- No duplicate model/type
- React Query is used for server state
- Redux Toolkit is used for client state
- Axios is centralized
- Permission logic remains centralized
- Next.js 16 APIs are used
- Ant Design 6 APIs are used
- Day.js is used for date operations
- SCSS follows project conventions
- No unnecessary dependency was added
- No unrelated code was modified
- Existing behavior is preserved

The AI MUST prioritize:

```text
Correctness
>
Consistency
>
Reuse
>
Simplicity
>
Performance
>
Minimal token usage
```

Do not optimize for writing more code.

Optimize for writing the smallest amount of correct code that fits the existing project.
