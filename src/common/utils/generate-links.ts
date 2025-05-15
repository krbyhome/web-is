import { Request } from 'express';
import { PaginationMeta } from '../dto/pagination-meta.dto';

export function generateLinks(
  req: Request,
  meta: PaginationMeta | null,
): string[] {
  if (!meta) {
    return [];
  }

  const { currentPage, totalPages } = meta;
  const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
  const links: string[] = [];

  if (currentPage < totalPages) {
    links.push(
      `<${baseUrl}?page=${currentPage + 1}&limit=${meta.itemsPerPage}>; rel="next"`,
    );
  }

  if (currentPage > 1) {
    links.push(
      `<${baseUrl}?page=${currentPage - 1}&limit=${meta.itemsPerPage}>; rel="prev"`,
    );
  }

  links.push(`<${baseUrl}?page=1&limit=${meta.itemsPerPage}>; rel="first"`);
  links.push(
    `<${baseUrl}?page=${totalPages}&limit=${meta.itemsPerPage}>; rel="last"`,
  );

  return links;
}
