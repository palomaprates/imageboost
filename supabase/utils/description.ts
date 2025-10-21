export function description() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const dateStr = `${day}/${month}/${year}`;

    return `Imagem gerada - ${dateStr}`;
}
