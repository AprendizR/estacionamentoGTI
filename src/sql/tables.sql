-- 1. Tabelas
create table modelos (
  id uuid default gen_random_uuid() primary key,
  marca varchar(100) not null,
  descricao varchar(100) not null
);

create table veiculos (
  id uuid default gen_random_uuid() primary key,
  placa char(7) not null,
  modelo_id uuid references modelos(id),
  ano integer,
  observacao varchar(100),
  data_saida timestamp with time zone,
  criado_em timestamp with time zone default now()
);

-- 2. Segurança (RLS)
alter table modelos enable row level security;
alter table veiculos enable row level security;

-- 3. Políticas (O "Mínimo" para usuários logados verem e criarem tudo)
create policy "Permitir tudo para autenticados" on modelos for all to authenticated using (true);
create policy "Permitir tudo para autenticados" on veiculos for all to authenticated using (true);

-- 4. Permissões de Acesso (Grants)
grant all on public.modelos to authenticated;
grant all on public.veiculos to authenticated;

-- 5. Dados Iniciais
insert into modelos (marca, descricao) values 
('Toyota', 'Corolla'),
('Honda', 'Civic'),
('Honda', 'HRv'),
('Volkswagen', 'Gol'),
('Volkswagen', 'Golf'),
('Volkswagen', 'Passat'),
('Fiat', 'Uno'),
('Fiat', 'Toro'),
('Ford', 'Mustang'),
('Ford', 'Ka');