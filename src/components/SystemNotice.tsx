import { useState } from "react";

export default function SystemNotice() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 max-w-sm bg-yellow-100 border border-yellow-300 text-yellow-900 p-4 rounded-xl shadow-lg">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h2 className="font-semibold text-lg">⚠️ Aviso importante</h2>
          <p className="text-sm mt-2">
            Nosso site passou por algumas mudanças recentes e pode apresentar bugs.
          </p>
          <p className="text-sm mt-1">
            O sistema de notificações está temporariamente indisponível.
          </p>
          <p className="text-sm mt-2">
            Caso encontre algum problema, entre em contato:
            <br />
            <a
              href="mailto:joaodev.azevedo@outlook.com"
              className="underline font-medium"
            >
              joaodev.azevedo@outlook.com
            </a>
          </p>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-yellow-900 hover:text-black font-bold text-lg"
          aria-label="Fechar aviso"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
