# Realtime Quickstart für HELGUS Marketplace

## 🎯 Übersicht

Dein Projekt hat bereits **Realtime Subscriptions** teilweise konfiguriert. Hier ist, was du tun musst, um alles zum Laufen zu bringen:

## ✅ Was ist bereits implementiert

### Existierende Hooks (in useQueryHooks.ts):
- ✅ `useMessagesSubscription()` - Nachrichten in Echtzeit
- ✅ `useConversationsSubscription()` - Konversationen in Echtzeit
- ✅ `useNotificationsSubscription()` - Benachrichtigungen in Echtzeit

### Neu hinzugefügt (in MarketplaceLayout aktiviert):
- ✨ `useProductRealtimeSync()` - Produkte live synchen
- ✨ `useProfileRealtimeSync()` - Profile live synchen
- ✨ `useRealtimeSubscription()` - Generischer Hook für beliebige Tabellen

## 🚀 Was du jetzt tun musst

### 1️⃣ Aktiviere Realtime im Supabase Dashboard

**WICHTIG**: Dies ist der kritische Schritt!

1. Gehe zu [Supabase Dashboard](https://supabase.com) → Dein Projekt
2. Navigiere zu: **Database** → **Replication**
3. Aktiviere Realtime für folgende Tabellen:

```
Tabelle: products
  ✓ INSERT (neue Produkte)
  ✓ UPDATE (Produktänderungen)
  ✓ DELETE (gelöschte Produkte)

Tabelle: profiles
  ✓ UPDATE (Profiländerungen)

Tabelle: messages
  ✓ INSERT (neue Nachrichten)
  ✓ UPDATE (Nachrichten-Status)

Tabelle: conversations
  ✓ UPDATE (Konversations-Updates)

Tabelle: notifications
  ✓ INSERT (neue Benachrichtigungen)
  ✓ UPDATE (Status-Änderungen)
  ✓ DELETE (gelöschte Benachrichtigungen)
```

### 2️⃣ Teste die Verbindung

Öffne deinen Browser und prüfe:

```
DevTools → Network → WS (WebSocket)
Du solltest sehen:
  - PostgreSQL Changes Subscription (postgres_changes)
  - mehrere aktive WebSocket-Verbindungen
```

### 3️⃣ Prüfe die Console für Logs

```javascript
// Du solltest sehen:
[Realtime] Product INSERT: ...
[Realtime] Message INSERT in conversation ...
[Realtime] Profile UPDATE: ...
```

## 📝 Beispiele zur Verwendung

### Beispiel 1: Custom Realtime Hook verwenden

```tsx
import { useRealtimeSubscription } from '@/marketplace/hooks'

function MyProductList() {
  const [products, setProducts] = useState([])

  useRealtimeSubscription('products', (event) => {
    if (event.type === 'INSERT') {
      setProducts(prev => [event.new, ...prev])
    } else if (event.type === 'UPDATE') {
      setProducts(prev =>
        prev.map(p => p.id === event.new?.id ? event.new : p)
      )
    } else if (event.type === 'DELETE') {
      setProducts(prev => prev.filter(p => p.id !== event.old?.id))
    }
  })

  return <div>{products.length} Produkte</div>
}
```

### Beispiel 2: Spezifische Konversation live synchen

```tsx
import { useConversationRealtimeSync } from '@/marketplace/hooks'

function ChatWindow({ conversationId }: { conversationId: string }) {
  // Diese Hook syncht automatisch Nachrichten dieser Konversation
  useConversationRealtimeSync(conversationId)

  // useConversationMessagesQuery wird automatisch bei Änderungen aktualisiert
  const { data: messages } = useConversationMessagesQuery(conversationId)

  return <div>{messages?.map(msg => <div>{msg.content}</div>)}</div>
}
```

### Beispiel 3: Überall verfügbar in MarketplaceLayout

```tsx
// Produkte und Profile werden überall live aktualisiert
// weil diese Hooks bereits in MarketplaceLayout aufgerufen werden

export function AnyComponent() {
  // Diese Daten aktualisieren sich automatisch in Echtzeit
  const { data: products } = useProductsQuery()
  const { data: profile } = useProfileQuery()

  return <div>Live Daten!</div>
}
```

## 🔍 Debugging-Tipps

### Problem: Realtime funktioniert nicht

```typescript
// Prüfe, dass die Subscriptions wirklich aufgerufen werden
const { isConnected, error } = useRealtimeSubscription('products', (event) => {
  console.log('Subscription aktiv!', event)
})

console.log('Verbunden:', isConnected)
if (error) console.error('Fehler:', error)
```

### Problem: Zu viele Requests

```typescript
// Nutze Debouncing bei vielen Änderungen
const debouncedRefresh = useCallback(
  debounce(() => {
    queryClient.invalidateQueries()
  }, 500),
  [queryClient]
)

useRealtimeSubscription('products', debouncedRefresh)
```

### Problem: RLS blockiert Subscriptions

```sql
-- Prüfe deine RLS Policies
SELECT * FROM auth.users; -- sollte dich zeigen

-- Beispiel Policy (erlaubt allen, Produkte zu sehen):
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Beispiel Policy (nur Verkäufer kann sein Produkt ändern):
CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = seller_id);
```

## 🎯 Nächste Schritte

- [ ] Aktiviere Realtime im Supabase Dashboard
- [ ] Teste mit Browser DevTools
- [ ] Überprüfe Console Logs
- [ ] Ändere ein Produkt/Profil in der DB → sollte sich live in der App aktualisieren
- [ ] Finde RLS-Policies in deiner Datenbank und überprüfe diese

## 📊 Performance-Tipps

1. **Nicht alle Spalten abonnieren**: Nutze Filter in Subscriptions
2. **Batch Updates**: Mehrere Änderungen = mehrere Invalidierungen
3. **Stale Time nutzen**: React Query cached für 1 Minute (siehe main.tsx)
4. **Pagination für große Listen**: Nicht alle Daten auf einmal

## 🔐 Security-Checkliste

- [ ] RLS ist aktiviert für alle Tabellen
- [ ] Policies sind restriktiv (nicht `USING (true)`)
- [ ] Nur authentifizierte Benutzer können Daten ändern
- [ ] Benutzer können nur ihre eigenen Daten sehen/ändern

---

Bei Fragen oder Problemen: Schau in [REALTIME_SETUP.md](./REALTIME_SETUP.md) für detaillierte Infos!
