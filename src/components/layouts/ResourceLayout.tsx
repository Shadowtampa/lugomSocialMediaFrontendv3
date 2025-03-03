import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function ResourceLayout() {
  const location = useLocation();

  const navigation = [
    { name: 'Produtos', href: '/resources/products' },
    { name: 'Promoções', href: '/resources/promotions' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Recursos</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gerencie seus produtos e promoções
          </p>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                  location.pathname === item.href
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
} 