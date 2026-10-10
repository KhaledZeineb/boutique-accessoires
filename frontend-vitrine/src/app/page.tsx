async function getProducts() {
  const apiUrl = process.env.STRAPI_URL || "http://backend:1337";

  for (let attempt = 1; attempt <= 10; attempt++) {
    try {
      const res = await fetch(
        `${apiUrl}/api/products?populate=*`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error(`Erreur API : ${res.status}`);
      }

      const result = await res.json();

      return Array.isArray(result.data) ? result.data : [];
    } catch (error) {
      if (attempt === 10) {
        console.error("Erreur de connexion à Strapi :", error);
        return [];
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return [];
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Boutique d'Accessoires
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">
          Aucun produit disponible pour le moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div
              key={product.id}
              className="bg-white p-5 rounded-lg shadow-md"
            >
              {product.image?.url && (
  <div className="w-full h-36 mb-4 flex items-center justify-center">
    <img
      src={`http://localhost:1337${product.image.url}`}
      alt={product.title}
      className="w-3/5 h-28 object-contain rounded"
    />
  </div>
)}

              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {product.title}
              </h2>

              <p className="text-gray-600 mb-2">
                {product.description}
              </p>

              <p className="text-blue-600 font-bold text-lg">
                {product.price} €
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Catégorie : {product.category?.name ?? "Non classé"}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}