import { Link, useNavigate } from 'react-router-dom';

interface BreadcrumbProps {
  pageName: string;
  showBackButton?: boolean;
}

const Breadcrumb = ({ pageName, showBackButton = false }: BreadcrumbProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {showBackButton && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-stroke px-3 py-1 text-sm font-medium transition hover:bg-gray-100 dark:border-strokedark dark:hover:bg-meta-4"
          >
            ← Volver
          </button>
        )}

        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          {pageName}
        </h2>
      </div>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link to="/">Dashboard /</Link>
          </li>

          <li className="text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
