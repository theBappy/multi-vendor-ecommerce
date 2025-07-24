interface QuickActionCardProps {
  title: string;
  description?: string;
  Icon: React.ElementType;
}


export const QuickActionCard = ({title, Icon, description}:QuickActionCardProps) => {
  return (
    <div className="bg-white p-4 cursor-pointer rounded-md shadow-sm border border-gray-100 flex items-start gap-4">
        <Icon className="w-6 h-6 text-blue-500 mt-1" />
        <div>
           <h4 className="text-sm font-semibold text-gray-800 mb-1">{title}</h4>
           <p className="text-sm text-gray-500">{description}</p>
        </div>
    </div>
  )
}

