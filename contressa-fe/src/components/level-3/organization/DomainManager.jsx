import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon, Language as LanguageIcon } from '@mui/icons-material';
import StyledTextField from '@/components/level-1/StyledTextField';

function DomainManager({
  initialDomains = [],
  onAddDomain = () => {}, // Added default functions
  onRemoveDomain = () => {}, // Added default functions
}) {
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState(initialDomains);

  const handleAddDomain = () => {
    if (domain && !domains.includes(domain)) {
      const updatedDomains = [...domains, domain];
      setDomains(updatedDomains);
      onAddDomain(domain); // Safely calls the function now
      setDomain('');
    }
  };

  const handleRemoveDomain = (domainToRemove) => {
    const updatedDomains = domains.filter((d) => d !== domainToRemove);
    setDomains(updatedDomains);
    onRemoveDomain(domainToRemove); // Safely calls the function now
  };

  return (
    <>
      <div className="flex gap-2">
        <div className="w-1/2">
          <StyledTextField
            className="flex-grow"
            label="Domain"
            placeholder="eg: evolve.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
        </div>
        <button variant="contained" onClick={handleAddDomain} className="border-2 px-4 rounded-md">
          Add
        </button>
      </div>

      {domains.map((d, index) => (
        <div key={d} className="flex rounded-sm border-2 p-2 items-center my-2 w-1/2">
          <LanguageIcon className="mr-2" />
          <p className="flex-grow">{d}</p>
          <IconButton onClick={() => handleRemoveDomain(d)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ))}
    </>
  );
}

export default DomainManager;
