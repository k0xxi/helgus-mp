# Supabase Realtime Setup Anleitung

## 🎯 Was ist Realtime?

Realtime ermöglicht es dir, Live-Aktualisierungen von Datenbankänderungen zu empfangen, ohne die Seite zu aktualisieren oder regelmäßig zu pollen.

## ✅ Schritt 1: Realtime im Supabase Dashboard aktivieren

1. Gehe zum **Supabase Dashboard** → Dein Projekt
2. Navigiere zu **Database** → **Tables**
3. Für jede Tabelle, die Realtime unterstützen soll:
   - Klick auf die Tabelle
   - Gehe zum **Replication** Tab
   - Aktiviere die Events: **INSERT**, **UPDATE**, **DELETE**

### Wichtige Tabellen für dein Projekt:
- ✅ `products` - Produktlisten in Echtzeit aktualisieren
- ✅ `profiles` - Profildaten synchronisieren
- ✅ `conversations` - Chat-Nachrichten live erhalten
- ✅ `notifications` - Benachrichtigungen sofort anzeigen

## 🔧 Schritt 2: Hooks verwenden

### Für automatische Syncs (bereits in MarketplaceLayout aktiviert):

```tsx
// Wird automatisch in MarketplaceLayout aufgerufen
useProductRealtimeSync()    // Synct Produktänderungen
useProfileRealtimeSync()     // Synct Profiländerungen
```

### Für benutzerdefinierte Subscriptions:

```tsx
import { useRealtimeSubscription } from '@/marketplace/hooks'

export function MyComponent() {
  const handleChange = (event) => {
    console.log('Änderung:', event.type, event.new)
    // Deine Logik hier
  }

  const { isConnected, error } = useRealtimeSubscription('products', handleChange)

  if (error) return <div>Verbindungsfehler: {error.message}</div>

  return (
    <div>
      {isConnected ? '🟢 Live verbunden' : '🔴 Nicht verbunden'}
    </div>
  )
}
```

## 📊 Beispiele

### Beispiel 1: Produktliste in Echtzeit aktualisieren

```tsx
import { useEffect } from 'react'
import { useRealtimeSubscription } from '@/marketplace/hooks'
import type { Tables } from '@/types/database'

export function ProductList() {
  const [products, setProducts] = useState<Tables<'products'>[]>([])

  const handleProductChange = (event: {
    type: 'INSERT' | 'UPDATE' | 'DELETE'
    new?: Tables<'products'>
    old?: Tables<'products'>
  }) => {
    if (event.type === 'INSERT' && event.new) {
      // Neues Produkt hinzufügen
      setProducts(prev => [event.new as Tables<'products'>, ...prev])
    } else if (event.type === 'UPDATE' && event.new) {
      // Produkt aktualisieren
      setProducts(prev =>
        prev.map(p => p.id === event.new?.id ? event.new as Tables<'products'> : p)
      )
    } else if (event.type === 'DELETE' && event.old) {
      // Produkt entfernen
      setProducts(prev => prev.filter(p => p.id !== event.old?.id))
    }
  }

  useRealtimeSubscription('products', handleProductChange)

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.title}</div>
      ))}
    </div>
  )
}
```

### Beispiel 2: Chat-Nachrichten in Echtzeit

```tsx
import { useRealtimeSubscription } from '@/marketplace/hooks'
import type { Tables } from '@/types/database'

export function ChatMessages({ conversationId }: { conversationId: string }) {
  const [messages, setMessages] = useState<Tables<'messages'>[]>([])

  const handleMessageChange = (event: {
    type: 'INSERT' | 'UPDATE' | 'DELETE'
    new?: Partial<Tables<'messages'>>
  }) => {
    if (event.type === 'INSERT' && event.new?.conversation_id === conversationId) {
      // Neue Nachricht nur für diese Konversation
      setMessages(prev => [...prev, event.new as Tables<'messages'>])
    }
  }

  useRealtimeSubscription('messages', handleMessageChange)

  return (
    <div className="space-y-2">
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}
```

## 🔐 Row Level Security (RLS)

Realtime respektiert deine RLS-Policies. Du musst RLS aktivieren und korrekte Policies setzen:

```sql
-- Beispiel: Benutzer können nur ihre eigenen Nachrichten sehen
CREATE POLICY "Users can see their own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
```

## 📋 Troubleshooting

### Problem: "Realtime nicht funktioniert"

1. **Realtime in Dashboard aktivieren**: Prüfe, dass die Tabelle im Replication Tab aktiviert ist
2. **Console logs prüfen**: Suche nach `[Realtime]` Log-Nachrichten
3. **Netzwerk prüfen**: WebSocket-Verbindung muss funktionieren
4. **RLS prüfen**: Stelle sicher, dass RLS Policies richtig gesetzt sind

### Problem: "Zu viele Requests"

- Nutze `queryClient.invalidateQueries()` statt direkte State Updates
- Debounce/Throttle bei vielen Änderungen
- Setze `staleTime` in React Query höher

### Problem: "Performance-Probleme"

- Filter Subscriptions: Nutze nur die Tabellen die du brauchst
- Setze Limits auf große Listen
- Nutze Pagination statt alle Daten zu synken

## 🎯 Best Practices

1. **Immer Fehlerbehandlung**: Realtime ist optional, nicht kritisch
2. **Kombiniere mit Polling**: Nutze beide für Redundanz
3. **Teste mit DevTools**: Öffne Browser DevTools → Network → WS, um WebSocket zu sehen
4. **Dokumentiere Policies**: Schreib RLS Policies klar auf

## 📚 Weitere Ressourcen

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime Quotas](https://supabase.com/docs/guides/realtime/rate-limits)
