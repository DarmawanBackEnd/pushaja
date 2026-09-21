# Design System Rules

## Icons
- **WAJIB** gunakan `lucide-react` untuk semua icon di seluruh proyek.
- **DILARANG** menggunakan emoticon/emoji (🔥, ⭐, 📦, dll.) sebagai pengganti icon.
- Import icon dari `lucide-react` secara individual, contoh:
  ```tsx
  import { Search, Star, ShoppingCart } from 'lucide-react';
  ```
- Gunakan props `size`, `strokeWidth`, dan `className` untuk styling icon sesuai kebutuhan.
