import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { nextUrl, cookies } = req;
    const token = cookies.get('token')?.value;

    const isLoggedIn = !!token; // Verifica si hay un token presente

    // Rutas públicas
    const publicRoutes = ["/register", "/login"];
    const protectedRoute = "/";  // Solo la raíz es la ruta protegida

    // Si el usuario está intentando acceder a una ruta pública
    if (publicRoutes.includes(nextUrl.pathname)) {
        // Si ya está loggeado, redirigir a la raíz
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/", req.url)); // Redirige a la raíz
        }
        return null; // Permite el acceso
    }

    // Si el usuario está intentando acceder a la ruta protegida (la raíz)
    if (nextUrl.pathname === protectedRoute) {
        // Si no está loggeado, redirigir a /login
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return null; // Permite el acceso
    }

    return null; // Permite el acceso a cualquier otra ruta
}

// Configura las rutas que deseas que este middleware controle
export const config = {
    matcher: ["/", "/register", "/login"],
};
