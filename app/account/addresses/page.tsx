
import { AddressCard } from '@/components/Acount/Address/AddressCard';
import { AddressForm } from '@/components/Acount/Address/AddressForm';
import { Card, CardContent } from '@/components/ui/card';
import { getAddresses } from '@/utils/action';
import { Plus } from 'lucide-react';

export default async function AddressesPage() {
  const userId = 'user-123';
  const addresses = await getAddresses(userId);
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Shopping Addresses</h1>
        <p className="text-[#677279] dark:text-gray-400 mt-2 font-medium">Manage your delivery addresses</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <AddressForm userId={userId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            userId={userId}
            onUpdate={() => {
              // Revalidate will happen automatically via server action
            }}
          />
        ))}
        {addresses.length === 0 && (
          <Card className="border-2 border-dashed border-slate-300 bg-white/50 col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No addresses yet
              </h3>
              <p className="text-sm text-slate-500 text-center mb-4">
                Add your first shipping address to get started
              </p>
              <AddressForm userId={userId} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}