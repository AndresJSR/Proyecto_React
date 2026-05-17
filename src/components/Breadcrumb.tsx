import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  items?: Array<{
    label: string;
    to?: string;
  }>;
}
const Breadcrumb = ({ pageName, items }: BreadcrumbProps) => {
  const trail = items && items.length > 0 ? items : [{ label: 'Dashboard', to: '/' }, { label: pageName }];

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-black dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;

            return (
              <li key={`${item.label}-${index}`} className={isLast ? 'text-primary' : ''}>
                {item.to && !isLast ? <Link to={item.to}>{item.label} /</Link> : item.label}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
