import PropTypes from "prop-types";
import { Card, CardContent } from "../ui/card";

export default function Cards({ title, value, icon }) {
  return (
    <Card className="flex items-center gap-4 p-4 shadow-md">
      <div className="text-3xl text-blue-600">{icon}</div>
      <CardContent className="p-0">
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-xl font-semibold">
          {value !== undefined && value !== null ? value : "—"}
        </p>
      </CardContent>
    </Card>
  );
}

Cards.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.element.isRequired,
};
