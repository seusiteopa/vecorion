"use client";

import { useId, useRef, useState } from "react";
import { UPLOAD_TAMANHO_MAXIMO_MB, UPLOAD_TIPOS_ACEITOS } from "@/lib/diagnostico/constants";

type CampoUploadProps = {
  arquivos: File[];
  onChange: (arquivos: File[]) => void;
};

/**
 * Upload client-side apenas nesta etapa (Etapa 8: "não implemente back-end"). A
 * validação de tipo/tamanho já roda aqui para dar feedback imediato ao usuário,
 * mas será repetida no servidor quando o back-end existir (Etapa 9+) — validação
 * no cliente nunca é a única linha de defesa (Etapa 2/7, seção de segurança).
 */
export default function CampoUpload({ arquivos, onChange }: CampoUploadProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState<string | null>(null);

  function validarEAdicionar(novosArquivos: FileList | null) {
    if (!novosArquivos) return;
    setErro(null);

    const aceitos: File[] = [];
    for (const arquivo of Array.from(novosArquivos)) {
      if (!UPLOAD_TIPOS_ACEITOS.includes(arquivo.type)) {
        setErro(`"${arquivo.name}" não é um tipo de arquivo aceito (imagem, PDF, planilha ou documento).`);
        continue;
      }
      if (arquivo.size > UPLOAD_TAMANHO_MAXIMO_MB * 1024 * 1024) {
        setErro(`"${arquivo.name}" é maior que ${UPLOAD_TAMANHO_MAXIMO_MB}MB — o limite atual.`);
        continue;
      }
      aceitos.push(arquivo);
    }

    if (aceitos.length > 0) {
      onChange([...arquivos, ...aceitos]);
    }
  }

  function removerArquivo(nome: string) {
    onChange(arquivos.filter((a) => a.name !== nome));
  }

  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        Arquivos (opcional)
      </label>
      <p className="text-sm text-ink/60">
        Imagens, PDFs, planilhas, documentos ou fluxogramas que ajudem a entender o processo.
        Não envie informações confidenciais ou dados pessoais desnecessários.
      </p>

      <div
        className="flex cursor-pointer flex-col items-center gap-2 rounded-card border-2 border-dashed border-ink/15 px-6 py-8 text-center transition-colors hover:border-brand/40"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          validarEAdicionar(e.dataTransfer.files);
        }}
      >
        <span className="text-sm font-semibold text-brand">Clique para escolher ou arraste os arquivos aqui</span>
        <span className="text-xs text-ink/60">Até {UPLOAD_TAMANHO_MAXIMO_MB}MB por arquivo</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          multiple
          accept={UPLOAD_TIPOS_ACEITOS.join(",")}
          className="sr-only"
          onChange={(e) => validarEAdicionar(e.target.files)}
        />
      </div>

      {erro && (
        <p role="alert" className="text-sm font-medium text-danger">
          {erro}
        </p>
      )}

      {arquivos.length > 0 && (
        <ul className="flex flex-col gap-2">
          {arquivos.map((arquivo) => (
            <li
              key={arquivo.name}
              className="flex items-center justify-between rounded-card bg-mist px-4 py-2 text-sm text-ink"
            >
              <span className="truncate">{arquivo.name}</span>
              <button
                type="button"
                onClick={() => removerArquivo(arquivo.name)}
                className="ml-3 shrink-0 text-xs font-semibold text-brand hover:text-brand-light"
                aria-label={`Remover ${arquivo.name}`}
              >
                Remover
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
