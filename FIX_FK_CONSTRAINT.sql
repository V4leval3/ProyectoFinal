-- Fix FK constraint to point to correct proyectos table
ALTER TABLE lista_interes DROP CONSTRAINT IF EXISTS fkqicjc9h6eh0enngvmnw3uh7e;

-- Add the correct foreign key pointing to proyectos (plural)
ALTER TABLE lista_interes ADD CONSTRAINT fk_lista_interes_proyecto 
  FOREIGN KEY (proyecto_id) REFERENCES proyectos(id) ON DELETE CASCADE;

-- Drop the unused proyecto table (singular) if it exists
DROP TABLE IF EXISTS proyecto;
