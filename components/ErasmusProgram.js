import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const ErasmusPrograms = ({}) => {
  const [erasmusPrograms, setErasmusPrograms] = useState([]);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [allErasmusPrograms, setAllErasmusPrograms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let role, uId;

  if (user) {
    role = user.role;
    uId = user[role]?.university;
  }

  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");

  useEffect(() => {
    const fetchErasmusPrograms = async () => {
      setIsLoading(true);
      const response = await axios.get("/api/erasmus/programs", {
        params: {
          uId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });

      setErasmusPrograms(response.data?.erasmusPrograms);
      setMessage(response.data?.message);
      setIsLoading(false);
    };
    fetchErasmusPrograms();
  }, [uId]);

  const toggleAll = async () => {
    const isAll = !allErasmusPrograms;
    setAllErasmusPrograms(isAll);

    if (isAll) {
      setIsLoading(true);
      const response = await axios.get("/api/erasmus/programs");
      setErasmusPrograms(response.data?.erasmusPrograms);
      setMessage(response.data?.message);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const response = await axios.get("/api/erasmus/programs", {
        params: {
          uId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setErasmusPrograms(response.data?.erasmusPrograms);
      setMessage(response.data?.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {user && (
            <div
              onClick={toggleAll}
              className="cursor-pointer hover:underline hover:text-blue-500">
              {allErasmusPrograms
                ? "Show university programs"
                : "Show all programs"}
            </div>
          )}

          <div>
            {message}{" "}
            {erasmusPrograms?.reduce(
              (totalLength, universityPrograms) =>
                totalLength + universityPrograms.programs.length,
              0
            )}{" "}
            programs {erasmusPrograms?.length} universities
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {erasmusPrograms?.map((universityPrograms, i) => (
              <ErasmusProgramItem
                key={uuid()}
                universityPrograms={universityPrograms}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ErasmusProgramItem = ({ universityPrograms }) => {
  const { university, programs } = universityPrograms;
  return (
    <div className="border p-4">
      <div className="mb-2">
        <div className="text-lg font-bold ">{university.name}</div>
        <div>{university.location}</div>
      </div>
      <div className="flex flex-col gap-2">
        {programs?.map((erasmusProgram, i) => (
          <>
            <div className="font-bold">
              {erasmusProgram.month}/{erasmusProgram.year} {erasmusProgram.name}
            </div>
            <div></div>
            <div>{erasmusProgram.description}</div>
          </>
        ))}
      </div>
    </div>
  );
};

export default ErasmusPrograms;
