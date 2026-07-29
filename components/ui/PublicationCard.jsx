"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faArrowUpRightFromSquare, faBookBookmark } from "@fortawesome/free-solid-svg-icons";
import Card, { CardBody, CardFooter } from "./Card";
import Badge from "./Badge";
import Button from "./Button";

export default function PublicationCard({ publication, className = "" }) {
  if (!publication) return null;

  const {
    title,
    venue,
    authors,
    date,
    abstract,
    doi,
    pdfUrl,
    pdf,
    link,
    citations,
  } = publication;

  const pdfLink = pdfUrl || pdf;
  const paperLink = link || (doi ? `https://doi.org/${doi}` : null);

  return (
    <Card
      variant="default"
      interactive
      className={`flex flex-col border border-[#E3DEC3] dark:border-[#33312B] ${className}`}
    >
      <CardBody>
        {/* Header metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          {venue && <Badge variant="orange">{venue}</Badge>}
          {date && (
            <span className="text-xs font-mono text-[#787467] dark:text-[#9E9A8B]">
              {date}
            </span>
          )}
        </div>

        {/* Paper title */}
        <h3 className="text-xl font-heading font-bold text-[#181713] dark:text-[#F7F5DC] mb-2 leading-snug">
          {title}
        </h3>

        {/* Authors */}
        {authors && (
          <p className="text-xs font-mono text-[#57534E] dark:text-[#9E9A8B] mb-3">
            <span className="font-semibold text-[#181713] dark:text-[#D1CDBC]">Authors:</span> {authors}
          </p>
        )}

        {/* Abstract snippet */}
        {abstract && (
          <p className="text-sm text-[#4A473E] dark:text-[#D1CDBC] line-clamp-3 leading-relaxed">
            {abstract}
          </p>
        )}
      </CardBody>

      {/* Action Footer */}
      <CardFooter>
        <div className="flex items-center gap-3">
          {pdfLink && (
            <Button
              href={pdfLink}
              variant="secondary"
              size="sm"
              icon={<FontAwesomeIcon icon={faFilePdf} className="text-red-500" />}
            >
              PDF
            </Button>
          )}
          {paperLink && (
            <Button
              href={paperLink}
              variant="outline"
              size="sm"
              icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
            >
              DOI / Publisher
            </Button>
          )}
        </div>

        {citations && (
          <span className="text-xs font-mono text-[#787467] dark:text-[#9E9A8B]">
            <FontAwesomeIcon icon={faBookBookmark} className="mr-1 text-amber-500" />
            {citations} Citations
          </span>
        )}
      </CardFooter>
    </Card>
  );
}
